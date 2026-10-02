function getPortalByRole(role) {
  const portals = {
    customer: "customer",
    salesman: "salesman",
    admin: "admin"
  };

  return portals[role] || null;
}

module.exports = {
  getPortalByRole
};