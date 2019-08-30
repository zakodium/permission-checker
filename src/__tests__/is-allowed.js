import PermissionsChecker from '..';

// Plain text

const permission = 'project:read:4';

test('permission ok', () => {
  expect(new PermissionsChecker(permission).isAllowed(permission)).toBe(true);
});

test('permission ko', () => {
  expect(new PermissionsChecker('project:read:5').isAllowed(permission)).toBe(
    false,
  );
});

const permissions = ['project:read:4', 'project:write:4'];

test('permissions ok', () => {
  expect(
    new PermissionsChecker([
      'project:read:4',
      'project:write:4',
      'project:write:5',
    ]).isAllowed(permissions),
  ).toBe(true);
});

test('permissions ko', () => {
  expect(
    new PermissionsChecker(['project:read:4', 'project:read:5']).isAllowed(
      permissions,
    ),
  ).toBe(false);
});

// With wildcards

const wildcardPermission = 'project:read:*';

test('permission with wildcard ok', () => {
  expect(
    new PermissionsChecker(wildcardPermission).isAllowed('project:read:4'),
  ).toBe(true);
});

test('permission with wildcard ko', () => {
  expect(
    new PermissionsChecker(wildcardPermission).isAllowed('project:write:4'),
  ).toBe(false);
});

const wildcardPermissions = ['project:*:4', 'project:read:*'];

test('permissions with wildcard ok', () => {
  expect(
    new PermissionsChecker(wildcardPermissions).isAllowed([
      'project:read:4',
      'project:write:4',
    ]),
  ).toBe(true);
});

test('permissions with wildcard ko', () => {
  expect(
    new PermissionsChecker(wildcardPermissions).isAllowed(['project:write:5']),
  ).toBe(false);
});

// every entities
test('permission on all entities ok', () => {
  expect(new PermissionsChecker('*:read:*').isAllowed(['project:read:5'])).toBe(
    true,
  );
});
test('permission on all entities ko', () => {
  expect(
    new PermissionsChecker('*:read:*').isAllowed(['project:write:5']),
  ).toBe(false);
});

// fast returns
test('first fast return ko', () => {
  expect(new PermissionsChecker([]).isAllowed('project:write:5')).toBe(false);
});

test('second fast return ok', () => {
  expect(new PermissionsChecker(['project:write:5']).isAllowed()).toBe(true);
});

// invalid slug
test('invalid slug ko', () => {
  expect(() =>
    new PermissionsChecker(['project:*']).isAllowed('project:write:5'),
  ).toThrow(`'project:*' is not a valid permission slug`);
});
