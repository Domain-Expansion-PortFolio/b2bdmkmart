import { useState, useEffect } from "react";
import { login, sendOtp, verifyOtp, getRedirectPath } from "./services/authService";
import "./Login.css";

// Reusable SVG Icon wrapper component
function Icon({ children, size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

// Left side marketing highlights matching the design
const features = [
  {
    text: "Wide Product Range",
    icon: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
  },
  {
    text: "Trusted Quality",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    text: "Built for Businesses",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

function getInitialRegisteredUser() {
  try {
    const stored = sessionStorage.getItem("dmk_registered_user");
    if (stored) {
      sessionStorage.removeItem("dmk_registered_user");
      return JSON.parse(stored);
    }
  } catch {
    // Safe fallback if sessionStorage is inaccessible
  }
  return null;
}

function Login({ onNavigateToSignup, onLoginSuccess }) {
  // Read any newly registered user profile transferred from Signup page
  const [initialUser] = useState(getInitialRegisteredUser);

  // Selected portal: "customer", "sales", or "admin"
  const [portal, setPortal] = useState(() => {
    if (initialUser?.role) {
      return initialUser.role === "sales" ? "sales" : initialUser.role === "admin" ? "admin" : "customer";
    }
    return "customer";
  });

  // Selected login method: "otp" or "password"
  const [mode, setMode] = useState(() => {
    return initialUser ? "password" : "otp";
  });

  // Input states
  const [mobile, setMobile] = useState(() => initialUser?.mobile || "");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState(() => initialUser?.identifier || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role-specific inputs
  const [territory, setTerritory] = useState("");
  const [adminSecurityKey, setAdminSecurityKey] = useState("DMK-ADMIN-2026");

  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Feedback and loading states
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(() => {
    return initialUser ? `Welcome ${initialUser.name || "back"}! Please enter your password to sign in.` : "";
  });
  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle portal switch
  const handlePortalChange = (newPortal) => {
    setPortal(newPortal);
    setError("");
    setSuccessMessage("");
    setOtpSent(false);
    setOtp("");
    // Default mode: OTP for customer, Password for Sales & Admin
    if (newPortal === "customer") {
      setMode("otp");
    } else {
      setMode("password");
    }
  };

  // Handle mode toggle
  const handleTabChange = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMessage("");
    setOtpSent(false);
    setOtp("");
  };

  // Quick-fill demo credentials for easy testing
  const handleFillDemo = (type) => {
    setError("");
    setSuccessMessage("");
    if (type === "customer") {
      setPortal("customer");
      setMode("password");
      setUsername("prateektandon2003@gmail.com");
      setPassword("Password@123");
      setMobile("9876543210");
    } else if (type === "sales") {
      setPortal("sales");
      setMode("password");
      setUsername("EMP-101");
      setPassword("Password@123");
      setMobile("9888888888");
      setTerritory("North Delhi Hub");
    } else if (type === "admin") {
      setPortal("admin");
      setMode("password");
      setUsername("admin@mail.com");
      setPassword("Password@123");
      setMobile("9999999999");
      setAdminSecurityKey("DMK-ADMIN-2026");
    }
  };

  // Step 1: Send verification OTP to user's mobile number
  async function handleSendOtp(e) {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(cleanMobile);
      setOtpSent(true);
      setResendTimer(60);
      if (response.otp) {
        setOtp(response.otp);
        setSuccessMessage(`OTP sent successfully! Demo Code: ${response.otp}`);
      } else {
        setSuccessMessage(
          response.message || "OTP sent successfully to your registered mobile number."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to send verification OTP");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify the 6-digit OTP and complete login
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    const cleanOtp = otp.trim();

    if (cleanOtp.length < 4) {
      setError("Please enter the verification OTP sent to your phone");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(cleanMobile, cleanOtp);
      setSuccessMessage("Login successful! Loading dashboard...");
      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess(data), 400);
      } else {
        const destination = getRedirectPath(data.portal || data.user?.role || portal);
        setTimeout(() => {
          window.location.href = destination;
        }, 500);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Password-based authentication for all 3 roles
  async function handlePasswordLogin(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!username.trim() || !password) {
      setError(
        portal === "sales"
          ? "Please enter your Employee ID or Work Email and password."
          : portal === "admin"
          ? "Please enter your Admin Username or Official Email and password."
          : "Please enter your Email, Username, or Mobile and password."
      );
      return;
    }

    if (portal === "admin" && !adminSecurityKey.trim()) {
      setError("Admin security passcode is required.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      setSuccessMessage("Login successful! Loading dashboard...");
      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess(data), 400);
      } else {
        const destination = getRedirectPath(data.portal || data.user?.role || portal);
        setTimeout(() => {
          window.location.href = destination;
        }, 500);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your login details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* LEFT SECTION: Branding & Feature Highlights */}
      <div className="login-left">
        <h1>
          Your Partner in
          <br />
          Quality Products
        </h1>
        {features.map((item) => (
          <div className="feature" key={item.text}>
            <span className="feature-icon">
              <Icon size={26}>{item.icon}</Icon>
            </span>
            <span className="feature-text">{item.text}</span>
          </div>
        ))}
      </div>

      {/* CENTER: Main Login Card */}
      <div className="login-card">
        {/* DMK Official Logo */}
        <img className="logo" src="/logo.png" alt="DMK Mart Logo" />

        <h2>Welcome to DMK Mart</h2>
        <p className="subtitle">Sign in to access your wholesale portal</p>

        {/* Portal Selection Dropdown */}
        <label className="field-label" htmlFor="portal-select">
          Select Portal Type
        </label>
        <select
          id="portal-select"
          className="select"
          value={portal}
          onChange={(e) => handlePortalChange(e.target.value)}
        >
          <option value="customer">Customer Portal</option>
          <option value="sales">Sales Team Portal</option>
          <option value="admin">Admin Portal</option>
        </select>

        {/* Quick Demo Credentials Bar */}
        <div className="demo-credentials-bar">
          <span className="demo-label">Quick Test:</span>
          <button
            type="button"
            className={`demo-chip ${portal === "customer" ? "active" : ""}`}
            onClick={() => handleFillDemo("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={`demo-chip ${portal === "sales" ? "active" : ""}`}
            onClick={() => handleFillDemo("sales")}
          >
            Sales (EMP-101)
          </button>
          <button
            type="button"
            className={`demo-chip ${portal === "admin" ? "active" : ""}`}
            onClick={() => handleFillDemo("admin")}
          >
            Admin
          </button>
        </div>

        {/* Login Method Toggle */}
        <label className="field-label">Choose Login Method</label>
        <div className="method-tabs" role="tablist">
          {portal === "customer" ? (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "otp"}
                className={mode === "otp" ? "method active" : "method"}
                onClick={() => handleTabChange("otp")}
              >
                <Icon size={18}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="14" y2="13" />
                </Icon>
                Login with OTP
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "password"}
                className={mode === "password" ? "method active" : "method"}
                onClick={() => handleTabChange("password")}
              >
                <Icon size={18}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
                Login with Password
              </button>
            </>
          ) : portal === "sales" ? (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "password"}
                className={mode === "password" ? "method active" : "method"}
                onClick={() => handleTabChange("password")}
              >
                <Icon size={18}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
                Staff Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "otp"}
                className={mode === "otp" ? "method active" : "method"}
                onClick={() => handleTabChange("otp")}
              >
                <Icon size={18}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="14" y2="13" />
                </Icon>
                Sales Mobile OTP
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "password"}
                className={mode === "password" ? "method active" : "method"}
                onClick={() => handleTabChange("password")}
              >
                <Icon size={18}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
                Master Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "otp"}
                className={mode === "otp" ? "method active" : "method"}
                onClick={() => handleTabChange("otp")}
              >
                <Icon size={18}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="14" y2="13" />
                </Icon>
                Emergency Admin OTP
              </button>
            </>
          )}
        </div>

        {/* Status Messages */}
        {error && <div className="error-text">{error}</div>}
        {successMessage && <div className="success-text">{successMessage}</div>}

        {/* OTP Authentication Form */}
        {mode === "otp" ? (
          !otpSent ? (
            /* Step 1: Mobile Number Input */
            <form onSubmit={handleSendOtp} noValidate>
              <label className="field-label" htmlFor="mobile-input">
                {portal === "sales"
                  ? "Registered Sales Mobile"
                  : portal === "admin"
                  ? "Emergency Admin Mobile"
                  : "Registered Mobile Number"}
              </label>
              <div className="mobile-group">
                <span className="country-code">+91</span>
                <input
                  id="mobile-input"
                  type="tel"
                  maxLength={10}
                  placeholder={portal === "admin" ? "9999999999" : portal === "sales" ? "9888888888" : "Enter 10-digit mobile"}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="main-button"
                disabled={loading || mobile.replace(/\D/g, "").length !== 10}
              >
                {loading ? "Sending OTP..." : "Send Verification OTP"}
                <Icon size={18}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </Icon>
              </button>

              <div className="secure-note">
                <Icon size={20} className="shield-icon">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </Icon>
                <span>
                  A 6-digit one-time password will be sent to verify your identity.
                </span>
              </div>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="otp-header-row">
                <label className="field-label" htmlFor="otp-input">
                  Enter Verification OTP
                </label>
                <button
                  type="button"
                  className="change-link"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                >
                  Change Mobile
                </button>
              </div>

              <div className="otp-input-wrap">
                <input
                  id="otp-input"
                  className="input otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>

              <div className="resend-row">
                {resendTimer > 0 ? (
                  <span className="resend-timer">
                    Resend OTP in <strong>{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="resend-button"
                    disabled={loading}
                    onClick={() => handleSendOtp()}
                  >
                    Resend Verification OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="main-button"
                disabled={loading || otp.trim().length === 0}
              >
                {loading ? "Verifying..." : "Verify OTP & Sign In"}
                <Icon size={18}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </Icon>
              </button>

              <div className="secure-note">
                <Icon size={20} className="shield-icon">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </Icon>
                <span>
                  Secure verification powered by DMK Mart account services.
                </span>
              </div>
            </form>
          )
        ) : (
          /* Password Authentication Form */
          <form onSubmit={handlePasswordLogin} noValidate>
            {/* Primary Identifier */}
            <label className="field-label" htmlFor="identifier-input">
              {portal === "sales"
                ? "Employee ID or Work Email"
                : portal === "admin"
                ? "Admin Username or Official Email"
                : "Email, Username, or Mobile"}
            </label>
            <input
              id="identifier-input"
              className="input"
              type="text"
              placeholder={
                portal === "sales"
                  ? "e.g. EMP-101 or sales@dmkmart.com"
                  : portal === "admin"
                  ? "e.g. admin or admin@mail.com"
                  : "e.g. prateektandon2003@gmail.com or 9876543210"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />

            {/* Sales-Specific Optional Field */}
            {portal === "sales" && (
              <>
                <label className="field-label" htmlFor="territory-input">
                  Assigned Branch / Territory <span className="label-optional">(Optional)</span>
                </label>
                <input
                  id="territory-input"
                  className="input"
                  type="text"
                  placeholder="e.g. North Delhi Hub"
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                />
              </>
            )}

            {/* Admin-Specific Passcode Field */}
            {portal === "admin" && (
              <>
                <label className="field-label" htmlFor="admin-key-input">
                  Admin Passcode Key <span className="passcode-hint">(Default: DMK-ADMIN-2026)</span>
                </label>
                <input
                  id="admin-key-input"
                  className="input"
                  type="text"
                  placeholder="DMK-ADMIN-2026"
                  value={adminSecurityKey}
                  onChange={(e) => setAdminSecurityKey(e.target.value)}
                />
              </>
            )}

            {/* Password Field */}
            <label className="field-label" htmlFor="password-input">
              {portal === "admin"
                ? "Master Admin Password"
                : portal === "sales"
                ? "Staff Account Password"
                : "Account Password"}
            </label>
            <div className="password-group">
              <input
                id="password-input"
                className="input password-field"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon size={18}>
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </Icon>
              </button>
            </div>

            <button
              type="submit"
              className="main-button"
              disabled={loading || !username.trim() || !password}
            >
              {loading
                ? "Signing in..."
                : portal === "sales"
                ? "Sign In to Sales Portal"
                : portal === "admin"
                ? "Authenticate Admin Console"
                : "Login to Customer Account"}
              <Icon size={18}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </Icon>
            </button>

            <div className="secure-note">
              <Icon size={20} className="shield-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </Icon>
              <span>
                {portal === "admin"
                  ? "Administrative console sessions are logged and monitored for compliance."
                  : portal === "sales"
                  ? "Access your assigned merchant beats, trade catalogs, and customer orders."
                  : "Enter your registered credentials to access your wholesale dashboard."}
              </span>
            </div>
          </form>
        )}

        {/* Link to Signup */}
        <div className="auth-switch">
          <span>Don't have an account?</span>{" "}
          <button
            type="button"
            className="switch-button"
            onClick={onNavigateToSignup}
          >
            Register Wholesale Account →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

