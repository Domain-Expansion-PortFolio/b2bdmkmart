import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:5000/api";

const pages = [
  { icon: "fa-house", name: "Home" },
  { icon: "fa-boxes-stacked", name: "Catalog" },
  { icon: "fa-magnifying-glass-plus", name: "Product Detail" },
  { icon: "fa-cart-shopping", name: "Cart" },
  { icon: "fa-credit-card", name: "Checkout" },
  { icon: "fa-lock", name: "Login" },
  { icon: "fa-user-plus", name: "Register" },
  { icon: "fa-receipt", name: "Orders" },
  { icon: "fa-envelope", name: "Contact" },
  { icon: "fa-fire", name: "Diwali Offer" },
];

function Login() {
  const [mode, setMode] = useState("otp");

  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // PASSWORD LOGIN
  // -----------------------------
  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT and user information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("portal", data.portal);

      setMessage("Login successful");

      console.log("Login successful:", data);

      // Temporary redirect until React Router is added
      if (data.portal === "admin") {
        window.location.href = "/admin";
      } else if (data.portal === "salesman") {
        window.location.href = "/salesman";
      } else if (data.portal === "customer") {
        window.location.href = "/customer";
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // SEND OTP
  // -----------------------------
  async function handleSendOtp(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setMessage("OTP sent successfully");

      console.log("OTP request:", data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  async function handleVerifyOtp(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Save JWT and user information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("portal", data.user.role);

      setMessage("OTP verified successfully");

      console.log("OTP login successful:", data);

      // Temporary redirect
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else if (data.user.role === "salesman") {
        window.location.href = "/salesman";
      } else if (data.user.role === "customer") {
        window.location.href = "/customer";
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* HEADER */}
      <header className="dmk-header-wrap">
        <div className="dmk-nav-container">
          <a href="#" className="logo">
            DMK<span>MART</span>
          </a>

          <a href="#" className="register-link">
            Need Wholesale Account? Register Free
          </a>
        </div>
      </header>

      {/* LOGIN CARD */}
      <div className="auth-wrap">
        <div className="auth-card">

          <div className="auth-title">
            <h2>Wholesale Partner Login</h2>
            <p>
              Access distributor rates, bulk slabs &amp; next-day delivery
            </p>
          </div>

          {/* TABS */}
          <div className="auth-tabs">

            <button
              type="button"
              className={
                mode === "otp"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() => {
                setMode("otp");
                setError("");
                setMessage("");
              }}
            >
              <i className="fa-solid fa-mobile-screen"></i>
              Mobile OTP
            </button>

            <button
              type="button"
              className={
                mode === "password"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() => {
                setMode("password");
                setError("");
                setMessage("");
              }}
            >
              <i className="fa-solid fa-key"></i>
              Password
            </button>

          </div>

          {/* MESSAGES */}
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* OTP FORM */}
          {mode === "otp" ? (

            !otpSent ? (

              <form onSubmit={handleSendOtp}>

                <div className="form-group">
                  <label>Registered Mobile Number</label>

                  <div className="mobile-row">
                    <span className="country-code">
                      +91
                    </span>

                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter 10-digit mobile"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={loading}
                >
                  <i className="fa-solid fa-paper-plane"></i>

                  {loading
                    ? " Sending..."
                    : " Send Verification OTP"}
                </button>

              </form>

            ) : (

              <form onSubmit={handleVerifyOtp}>

                <div className="form-group">

                  <label>
                    Enter Verification OTP
                  </label>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    maxLength={6}
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={loading}
                >
                  <i className="fa-solid fa-check"></i>

                  {loading
                    ? " Verifying..."
                    : " Verify OTP"}
                </button>

              </form>

            )

          ) : (

            /* PASSWORD FORM */

            <form onSubmit={handleLogin}>

              <div className="form-group">

                <label>
                  Email Address or Username
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Email or username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Account Password
                </label>

                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >

                <i className="fa-solid fa-right-to-bracket"></i>

                {loading
                  ? " Logging in..."
                  : " Login to Account"}

              </button>

            </form>

          )}

          <div className="auth-footer">
            Not registered yet?{" "}
            <a href="#">
              Apply for GST Wholesale Account
            </a>
          </div>

        </div>
      </div>

      {/* FLOATING PAGES BAR */}
      <div className="preview-page-switcher">

        <div className="switcher-label">
          <i className="fa-solid fa-layer-group"></i>
          Pages
        </div>

        {pages.map((p) => (
          <a
            key={p.name}
            href="#"
            className={
              p.name === "Login"
                ? "active"
                : p.name === "Diwali Offer"
                ? "diwali"
                : ""
            }
          >
            <i
              className={
                "fa-solid " + p.icon
              }
            ></i>{" "}
            {p.name}
          </a>
        ))}

      </div>

    </div>
  );
}

export default Login;
