export default class PermissionsChecker {
  constructor(requesterPermissions) {
    this._requesterPermissions =
      typeof requesterPermissions === 'string'
        ? [requesterPermissions]
        : requesterPermissions;
  }

  isAllowed(requiredPermissions) {
    const requiredPerms = (typeof requiredPermissions === 'string'
      ? [requiredPermissions]
      : requiredPermissions
    ).map((requiredPermission) => {
      const permParts = requiredPermission.split(':');
      return {
        slug: requiredPermission,
        entity: permParts[0] || null,
        action: permParts[1] || null,
        identifier: permParts[2] || null,
      };
    });

    const requesterPermissions = this._requesterPermissions.map(
      (requesterPermission) => {
        const permParts = requesterPermission.split(':');
        return {
          slug: requesterPermission,
          entity: permParts[0] || null,
          action: permParts[1] || null,
          identifier: permParts[2] || null,
        };
      },
    );

    const fulfilledPermissions = requiredPerms.map(
      (requiredPermission) =>
        requesterPermissions.filter(
          (requesterPermission) =>
            (requiredPermission.entity === requesterPermission.entity ||
              requesterPermission.entity === '*') &&
            (requiredPermission.action === requesterPermission.action ||
              requesterPermission.action === '*') &&
            (requiredPermission.identifier === requesterPermission.identifier ||
              requesterPermission.identifier === '*'),
        ).length > 0,
    );
    return fulfilledPermissions.every(
      (fulfilledPermission) => fulfilledPermission === true,
    );
  }
}
