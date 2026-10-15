import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import { clearToken } from "./api";

function App() {
  // Authenticated user state initialized from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Current view: "login" or "signup"
  const [view, setView] = useState(() => {
    return window.location.hash === "#signup" ? "signup" : "login";
  });

  // Listen for browser navigation (back/forward hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#signup") {
        setView("signup");
      } else {
        setView("login");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToSignup = () => {
    window.location.hash = "#signup";
    setView("signup");
  };

  const navigateToLogin = () => {
    window.location.hash = "#login";
    setView("login");
  };

  // Called when login is verified successfully
  const handleLoginSuccess = (authData) => {
    const userProfile = authData?.user || {
      role: authData?.portal || authData?.role || "customer",
      email: authData?.email,
      username: authData?.username,
      mobile: authData?.mobile,
    };
    setCurrentUser(userProfile);
  };

  // Sign out cleanly
  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("portal");
    setCurrentUser(null);
    navigateToLogin();
  };

  // 1. Authenticated session: show role dashboard
  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 2. Unauthenticated views: Signup or Login
  return view === "signup" ? (
    <Signup onNavigateToLogin={navigateToLogin} />
  ) : (
    <Login
      onNavigateToSignup={navigateToSignup}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;
