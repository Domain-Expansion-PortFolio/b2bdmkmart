import { useState } from "react";
import "./Signup.css";

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

// Left side marketing highlights matching the login design
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

function Signup({ onNavigateToLogin }) {
  // Selected role: "customer", "sales", or "admin"
  const [role, setRole] = useState("customer");

  // Common credentials
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Customer-specific fields
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Kirana / Grocery Store");
  const [gstNumber, setGstNumber] = useState("");
  const [cityPincode, setCityPincode] = useState("");

  // Sales-specific fields
  const [repName, setRepName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [salesZone, setSalesZone] = useState("North Zone (Delhi NCR)");
  const [managerCode, setManagerCode] = useState("");

  // Admin-specific fields
  const [adminName, setAdminName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminSecurityKey, setAdminSecurityKey] = useState("");
  const [department, setDepartment] = useState("Operations & Inventory");

  // Feedback states (pure frontend simulation)
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Switch role handler: resets role-specific inputs and errors
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setSuccessMessage("");
  };

  // Purely frontend registration handler (no backend API call required)
  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // 1. Mobile number validation
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // 2. Email format validation
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    // 3. Password validations
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    // 4. Role-specific validations
    if (role === "customer") {
      if (!fullName.trim()) {
        setError("Please enter your full contact name.");
        return;
      }
      if (!businessName.trim()) {
        setError("Please enter your business or shop name.");
        return;
      }
    } else if (role === "sales") {
      if (!repName.trim()) {
        setError("Please enter the representative full name.");
        return;
      }
      if (!employeeId.trim()) {
        setError("Please enter your official DMK employee ID (e.g. EMP-101).");
        return;
      }
    } else if (role === "admin") {
      if (!adminName.trim()) {
        setError("Please enter the administrator full name.");
        return;
      }
      if (!adminUsername.trim()) {
        setError("Please enter an administrative username.");
        return;
      }
      if (!adminSecurityKey.trim()) {
        setError("Admin security passcode is required for administrative account creation.");
        return;
      }
      // Demo validation for admin authorization code
      if (adminSecurityKey.trim().toUpperCase() !== "DMK-ADMIN-2026") {
        setError("Invalid Admin security passcode. Use authorization code: DMK-ADMIN-2026.");
        return;
      }
    }

    // 5. Successful frontend registration
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const registeredData = {
        role,
        identifier: role === "sales" ? employeeId.trim() : role === "admin" ? adminUsername.trim() : cleanEmail,
        mobile: cleanMobile,
        email: cleanEmail,
        name: role === "sales" ? repName.trim() : role === "admin" ? adminName.trim() : fullName.trim(),
        registeredAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem("dmk_registered_user", JSON.stringify(registeredData));
      } catch {
        // Safe fallback if sessionStorage is restricted
      }

      const roleDisplay =
        role === "customer" ? "Customer" : role === "sales" ? "Sales Representative" : "Administrator";

      setSuccessMessage(
        `Registration successful! ${roleDisplay} account has been created. Redirecting to Sign In...`
      );

      // Smooth transition to Login page after 1.4 seconds
      setTimeout(() => {
        if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 1400);
    }, 450);
  };

  return (
    <div className="signup-page">
      {/* LEFT SECTION: Branding & Feature Highlights */}
      <div className="signup-left">
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

      {/* CENTER: Main Registration Card */}
      <div className="signup-card">
        {/* DMK Official Logo */}
        <img className="logo" src="/logo.png" alt="DMK Mart Logo" />

        <h2>Create an Account</h2>
        <p className="subtitle">Register to unlock wholesale catalogs, trade pricing & portal tools</p>

        {/* Role Selector Tabs */}
        <label className="field-label" htmlFor="role-select">
          Select Account Role
        </label>
        <div className="role-tabs" role="tablist">
          <button
            type="button"
            className={role === "customer" ? "role-tab active" : "role-tab"}
            onClick={() => handleRoleChange("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === "sales" ? "role-tab active" : "role-tab"}
            onClick={() => handleRoleChange("sales")}
          >
            Sales Team
          </button>
          <button
            type="button"
            className={role === "admin" ? "role-tab active" : "role-tab"}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>

        {/* Status Alerts */}
        {error && <div className="error-text">{error}</div>}
        {successMessage && <div className="success-text">{successMessage}</div>}

        <form onSubmit={handleSignup} noValidate>
          {/* =========================================================
              CUSTOMER FIELDS
              ========================================================= */}
          {role === "customer" && (
            <div className="role-fields-block">
              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="cust-fullname">
                    Contact Person Name
                  </label>
                  <input
                    id="cust-fullname"
                    className="input"
                    type="text"
                    placeholder="e.g. Prateek Tandon"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="cust-bizname">
                    Business / Shop Name
                  </label>
                  <input
                    id="cust-bizname"
                    className="input"
                    type="text"
                    placeholder="e.g. Metro Mart & Kirana"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="cust-bizcategory">
                    Business Category
                  </label>
                  <select
                    id="cust-bizcategory"
                    className="select"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  >
                    <option value="Kirana / Grocery Store">Kirana / Grocery Store</option>
                    <option value="Supermarket & Hypermarket">Supermarket & Hypermarket</option>
                    <option value="HoReCa (Hotel, Restaurant, Cafe)">HoReCa (Hotel/Restaurant/Cafe)</option>
                    <option value="Wholesale Distributor">Wholesale Distributor</option>
                    <option value="Convenience & Dairy Store">Convenience & Dairy Store</option>
                    <option value="Other Retail Business">Other Retail Business</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="cust-gstin">
                    GSTIN Number <span className="label-optional">(Optional)</span>
                  </label>
                  <input
                    id="cust-gstin"
                    className="input"
                    type="text"
                    maxLength={15}
                    placeholder="15-digit GSTIN"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="cust-city">
                  Store City & Pincode <span className="label-optional">(Optional)</span>
                </label>
                <input
                  id="cust-city"
                  className="input"
                  type="text"
                  placeholder="e.g. New Delhi - 110001"
                  value={cityPincode}
                  onChange={(e) => setCityPincode(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* =========================================================
              SALES TEAM FIELDS
              ========================================================= */}
          {role === "sales" && (
            <div className="role-fields-block">
              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="sales-repname">
                    Representative Name
                  </label>
                  <input
                    id="sales-repname"
                    className="input"
                    type="text"
                    placeholder="e.g. Vikram Sharma"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="sales-empid">
                    Employee ID / Staff Code
                  </label>
                  <input
                    id="sales-empid"
                    className="input"
                    type="text"
                    placeholder="e.g. EMP-101"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="sales-zone">
                    Assigned Territory / Zone
                  </label>
                  <select
                    id="sales-zone"
                    className="select"
                    value={salesZone}
                    onChange={(e) => setSalesZone(e.target.value)}
                  >
                    <option value="North Zone (Delhi NCR)">North Zone (Delhi NCR)</option>
                    <option value="South Zone (Bengaluru Hub)">South Zone (Bengaluru Hub)</option>
                    <option value="West Zone (Mumbai Region)">West Zone (Mumbai Region)</option>
                    <option value="East Zone (Kolkata Hub)">East Zone (Kolkata Hub)</option>
                    <option value="Central Zone (Bhopal Hub)">Central Zone (Bhopal Hub)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="sales-mgr">
                    Reporting Manager Code <span className="label-optional">(Optional)</span>
                  </label>
                  <input
                    id="sales-mgr"
                    className="input"
                    type="text"
                    placeholder="e.g. MGR-204"
                    value={managerCode}
                    onChange={(e) => setManagerCode(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN FIELDS
              ========================================================= */}
          {role === "admin" && (
            <div className="role-fields-block">
              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="admin-fullname">
                    Administrator Full Name
                  </label>
                  <input
                    id="admin-fullname"
                    className="input"
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="admin-uname">
                    Admin Username
                  </label>
                  <input
                    id="admin-uname"
                    className="input"
                    type="text"
                    placeholder="e.g. admin_ops"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="admin-dept">
                    Administrative Access Level
                  </label>
                  <select
                    id="admin-dept"
                    className="select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Operations & Inventory">Operations & Inventory</option>
                    <option value="Super Admin (Full Access)">Super Admin (Full Access)</option>
                    <option value="Finance & Billing Audits">Finance & Billing Audits</option>
                    <option value="System & User Management">System & User Management</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="admin-seckey">
                    Master Passcode <span className="passcode-hint">(Key: DMK-ADMIN-2026)</span>
                  </label>
                  <input
                    id="admin-seckey"
                    className="input"
                    type="text"
                    placeholder="e.g. DMK-ADMIN-2026"
                    value={adminSecurityKey}
                    onChange={(e) => setAdminSecurityKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              COMMON CONTACT & CREDENTIAL FIELDS
              ========================================================= */}
          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="signup-mobile">
                {role === "admin" ? "Emergency Mobile Number" : role === "sales" ? "Official Work Mobile" : "Mobile Number"}
              </label>
              <div className="mobile-group">
                <span className="country-code">+91</span>
                <input
                  id="signup-mobile"
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="signup-email">
                {role === "admin" ? "Official Admin Email" : role === "sales" ? "Official Work Email" : "Email Address"}
              </label>
              <input
                id="signup-email"
                className="input"
                type="email"
                placeholder={role === "sales" ? "name@dmkmart.com" : role === "admin" ? "admin@dmkmart.com" : "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="signup-password">
                Create Password
              </label>
              <div className="password-group">
                <input
                  id="signup-password"
                  className="input password-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
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
            </div>

            <div>
              <label className="field-label" htmlFor="signup-confirmpassword">
                Confirm Password
              </label>
              <div className="password-group">
                <input
                  id="signup-confirmpassword"
                  className="input password-field"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <Icon size={18}>
                    {showConfirmPassword ? (
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
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="main-button"
            disabled={
              loading ||
              mobile.replace(/\D/g, "").length !== 10 ||
              password.length < 6 ||
              password !== confirmPassword
            }
          >
            {loading
              ? "Registering Account..."
              : role === "customer"
              ? "Create Wholesale Account"
              : role === "sales"
              ? "Register Sales Account"
              : "Register Admin Account"}
            <Icon size={18}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </Icon>
          </button>

          {/* Security & Verification Note */}
          <div className="secure-note">
            <Icon size={20} className="shield-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </Icon>
            <span>
              All registration profiles are securely encrypted and protected under DMK Mart B2B trade policy.
            </span>
          </div>

          {/* Link back to Login */}
          <div className="auth-switch">
            <span>Already have an account?</span>{" "}
            <button
              type="button"
              className="switch-button"
              onClick={onNavigateToLogin}
            >
              Sign In Here →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

