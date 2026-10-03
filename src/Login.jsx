import { useState } from "react";
import "./Login.css";


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

  const [mobile, setMobile] = useState("9822014892");
  const [username, setUsername] = useState("admin@mail.com");
  const [password, setPassword] = useState("Password@123");

  function handleSendOtp(e) {
    e.preventDefault();
    console.log("Mobile:", mobile);
  }

  function handleLogin(e) {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
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
            <p>Access distributor rates, bulk slabs &amp; next-day delivery</p>
          </div>

          {/* TABS */}
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "otp" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("otp")}
            >
              <i className="fa-solid fa-mobile-screen"></i> Mobile OTP
            </button>
            <button
              type="button"
              className={mode === "password" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("password")}
            >
              <i className="fa-solid fa-key"></i> Password
            </button>
          </div>

          {/* OTP FORM */}
          {mode === "otp" ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Registered Mobile Number</label>
                <div className="mobile-row">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter 10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-auth-submit">
                <i className="fa-solid fa-paper-plane"></i> Send Verification OTP
              </button>
            </form>
          ) : (
            /* PASSWORD FORM */
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address or Username</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@mail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Account Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-auth-submit">
                <i className="fa-solid fa-right-to-bracket"></i> Login to Account
              </button>
            </form>
          )}

          <div className="auth-footer">
            Not registered yet? <a href="#">Apply for GST Wholesale Account</a>
          </div>
        </div>
      </div>

      {/* FLOATING PAGES BAR */}
      <div className="preview-page-switcher">
        <div className="switcher-label">
          <i className="fa-solid fa-layer-group"></i> Pages
        </div>
        {pages.map((p) => (
          <a
            key={p.name}
            href="#"
            className={
              p.name === "Login" ? "active" : p.name === "Diwali Offer" ? "diwali" : ""
            }
          >
            <i className={"fa-solid " + p.icon}></i> {p.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Login;
