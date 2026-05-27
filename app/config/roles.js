const rolePermissions = {
  admin: {
    permissions: [
      "create_record",
      "read_record",
      "update_record",
      "delete_record",
    ],
  },
  user: {
    permissions: ["read_record"],
  },
};

const hasPermission = (userRole, requiredPermission) => {
  const role = rolePermissions[userRole];
  if (!role) return false;
  return role.permissions.includes(requiredPermission);
};

module.exports = {
  rolePermissions,
  hasPermission,
};
