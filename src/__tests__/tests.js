import PermissionsChecker from '..';

// Plain text

const permission = 'project:read:4';

test('permission ok', () => {
  expect(new PermissionsChecker(permission, permission).isAllowed()).toBe(true);
});

test('permission ko', () => {
  expect(new PermissionsChecker(permission, 'project:read:5').isAllowed()).toBe(
    false,
  );
});

const permissions = ['project:read:4', 'project:write:4'];

test('permissions ok', () => {
  expect(
    new PermissionsChecker(permissions, [
      'project:read:4',
      'project:write:4',
      'project:write:5',
    ]).isAllowed(),
  ).toBe(true);
});

test('permissions ko', () => {
  expect(
    new PermissionsChecker(permissions, [
      'project:read:4',
      'project:read:5',
    ]).isAllowed(),
  ).toBe(false);
});

// With wildcards

const wildcardPermission = 'project:read:*';

test('permission with wildcard ok', () => {
  expect(
    new PermissionsChecker('project:read:4', wildcardPermission).isAllowed(),
  ).toBe(true);
});

test('permission with wildcard ko', () => {
  expect(
    new PermissionsChecker('project:write:4', wildcardPermission).isAllowed(),
  ).toBe(false);
});

const wildcardPermissions = ['project:*:4', 'project:read:*'];

test('permissions with wildcard ok', () => {
  expect(
    new PermissionsChecker(
      ['project:read:4', 'project:write:4'],
      wildcardPermissions,
    ).isAllowed(),
  ).toBe(true);
});

test('permissions with wildcard ko', () => {
  expect(
    new PermissionsChecker(
      ['project:write:5'],
      wildcardPermissions,
    ).isAllowed(),
  ).toBe(false);
});
