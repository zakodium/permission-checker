export default class PermissionsChecker {
  constructor(requesterPermissions) {
    this._requesterPermissions =
      typeof requesterPermissions === 'string'
        ? [requesterPermissions]
        : requesterPermissions;
  }

  isAllowed(requiredPermissions) {
    // fast returns
    if (this._requesterPermissions.length === 0 && requiredPermissions > 0) {
      return false;
    }
    if (requiredPermissions.length === 0) {
      return true;
    }

    // extract parts from slug
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
    const requesterPerms = this._requesterPermissions.map(
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

    // compute permissions value
    const fulfilledPermissions = requiredPerms.map(
      (requiredPermission) =>
        requesterPerms.filter(
          (requesterPermission) =>
            (requiredPermission.entity === requesterPermission.entity ||
              requesterPermission.entity === '*') &&
            (requiredPermission.action === requesterPermission.action ||
              requesterPermission.action === '*') &&
            (requiredPermission.identifier === requesterPermission.identifier ||
              requesterPermission.identifier === '*'),
        ).length > 0,
    );

    // is allowd if every permissions values are true
    return fulfilledPermissions.every(
      (fulfilledPermission) => fulfilledPermission === true,
    );
  }
}
