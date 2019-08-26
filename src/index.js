import InvalidPermissionSlug from './errors/InvalidPermissionSlug.js';

export default class PermissionsChecker {
  constructor(requesterPermissions) {
    this._requesterPermissions = this._ensurePermissionsArray(
      requesterPermissions,
    );
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
    const requiredPerms = this._ensurePermissionsArray(requiredPermissions).map(
      this._extractPermissionsParts,
    );
    const requesterPerms = this._requesterPermissions.map(
      this._extractPermissionsParts,
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

  _ensurePermissionsArray(permissions) {
    return typeof permissions === 'string' ? [permissions] : permissions;
  }

  _extractPermissionsParts(permission) {
    const permParts = permission.split(':');
    if (permParts.length !== 3) {
      throw new InvalidPermissionSlug(
        `'${permission}' is not a valid permission slug`,
      );
    }
    return {
      slug: permission,
      entity: permParts[0],
      action: permParts[1],
      identifier: permParts[2],
    };
  }
}
