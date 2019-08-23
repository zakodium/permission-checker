export default class PermissionsChecker {
  constructor(requiredPermissions, requesterPermissions) {
    this._requiredPermissions =
      typeof requiredPermissions === 'string'
        ? [requiredPermissions]
        : requiredPermissions;
    this._requesterPermissions =
      typeof requesterPermissions === 'string'
        ? [requesterPermissions]
        : requesterPermissions;

    this._allowed = null;
  }

  _computePermission() {
    const requiredPermissions = this._requiredPermissions.map(
      (requiredPermission) => {
        const permParts = requiredPermission.split(':');
        return {
          slug: requiredPermission,
          entity: permParts[0] || null,
          action: permParts[1] || null,
          identifier: permParts[2] || null,
        };
      },
    );

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

    const fulfilledPermissions = requiredPermissions.map(
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
    this._allowed = fulfilledPermissions.every(
      (fulfilledPermission) => fulfilledPermission === true,
    );

    /*
    // si toutes les permissions requises sont ok
      // OK
    // sinon
      // KO
      */
    return this;
  }

  isAllowed() {
    if (this._allowed === null) this._computePermission();
    return this._allowed;
  }
}
