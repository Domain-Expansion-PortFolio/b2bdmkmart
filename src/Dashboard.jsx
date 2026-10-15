import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const role = user?.role || "customer";
  const portalName =
    role === "admin"
      ? "Master Admin Portal"
      : role === "salesman" || role === "sales"
      ? "Sales Team Portal"
      : "Wholesale Customer Portal";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Navigation Header */}
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <img src="/logo.png" alt="DMK Mart Official Logo" />
            <div>
              <h1>DMK Mart Wholesale</h1>
              <span className="dashboard-portal-tag">{portalName}</span>
            </div>
          </div>
          <button type="button" className="logout-button" onClick={onLogout}>
            Sign Out
          </button>
        </header>

        {/* Welcome Profile Card */}
        <div className="dashboard-welcome-card">
          <div className="welcome-title-row">
            <h2>Welcome back, {user?.username || user?.email || "Partner"}!</h2>
            <span className="status-badge">
              Status: {user?.accountStatus ? user.accountStatus.toUpperCase() : "ACTIVE"}
            </span>
          </div>
          <p className="welcome-subtitle">
            You are successfully authenticated and connected to the DMK Mart wholesale system.
          </p>

          <div className="profile-info-grid">
            <div className="info-item">
              <span className="info-label">Account Role</span>
              <span className="info-value">{role.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Registered Identifier</span>
              <span className="info-value">{user?.email || user?.username || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Mobile</span>
              <span className="info-value">+91 {user?.mobile || "9876543210"}</span>
            </div>
            {role === "salesman" || role === "sales" ? (
              <div className="info-item">
                <span className="info-label">Staff Code</span>
                <span className="info-value">EMP-101</span>
              </div>
            ) : role === "admin" ? (
              <div className="info-item">
                <span className="info-label">Security Tier</span>
                <span className="info-value">Super Admin (Verified)</span>
              </div>
            ) : (
              <div className="info-item">
                <span className="info-label">Pricing Tier</span>
                <span className="info-value">Tier-1 Wholesale Direct</span>
              </div>
            )}
          </div>
        </div>

        {/* Role-Specific Metric Overview */}
        <div className="metrics-row">
          {role === "admin" ? (
            <>
              <div className="metric-card">
                <span className="metric-title">Registered Accounts</span>
                <span className="metric-number">1,248</span>
                <span className="metric-sub">+18 this week</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Pending Verifications</span>
                <span className="metric-number">3</span>
                <span className="metric-sub">Ready for review</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">System Status</span>
                <span className="metric-number">100%</span>
                <span className="metric-sub">All nodes operational</span>
              </div>
            </>
          ) : role === "salesman" || role === "sales" ? (
            <>
              <div className="metric-card">
                <span className="metric-title">Assigned Retailers</span>
                <span className="metric-number">48</span>
                <span className="metric-sub">Active merchant beat</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Today's Orders</span>
                <span className="metric-number">14</span>
                <span className="metric-sub">₹1,84,500 booked</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Target Achievement</span>
                <span className="metric-number">86%</span>
                <span className="metric-sub">On track for month</span>
              </div>
            </>
          ) : (
            <>
              <div className="metric-card">
                <span className="metric-title">Trade Credit Limit</span>
                <span className="metric-number">₹2,50,000</span>
                <span className="metric-sub">Available for orders</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Active Orders</span>
                <span className="metric-number">4</span>
                <span className="metric-sub">Dispatched & in transit</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Reward Points</span>
                <span className="metric-number">3,820</span>
                <span className="metric-sub">Redeem on next invoice</span>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="actions-card">
          <h3>Quick Portal Tools</h3>
          <div className="action-buttons-grid">
            {role === "admin" ? (
              <>
                <button type="button" className="action-card-btn">Manage Users & Roles</button>
                <button type="button" className="action-card-btn">Wholesale Approvals</button>
                <button type="button" className="action-card-btn">Inventory Master</button>
                <button type="button" className="action-card-btn">Audit & Security Logs</button>
              </>
            ) : role === "salesman" || role === "sales" ? (
              <>
                <button type="button" className="action-card-btn">Merchant Beat Map</button>
                <button type="button" className="action-card-btn">Create Client Order</button>
                <button type="button" className="action-card-btn">Catalog Price List</button>
                <button type="button" className="action-card-btn">Daily Sales Summary</button>
              </>
            ) : (
              <>
                <button type="button" className="action-card-btn">Browse Wholesale Catalog</button>
                <button type="button" className="action-card-btn">Quick Bulk Re-Order</button>
                <button type="button" className="action-card-btn">Invoice History</button>
                <button type="button" className="action-card-btn">Trade Credit Statement</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

