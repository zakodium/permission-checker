import PermissionsChecker from '..';

test('get accessibles ressources', () => {
  expect(
    new PermissionsChecker([
      'project:read:1',
      'project:read:10',
      'project:write:10',
      'project:read:5',
      'project:read:4',
    ]).getAccessibleRessources('project', 'read'),
  ).toStrictEqual(['1', '10', '5', '4']);
});

test('get accessible ressources entity wildcard', () => {
  expect(
    new PermissionsChecker([
      '*:read:1',
      '*:read:5',
      '*:read:9',
      '*:read:10',
    ]).getAccessibleRessources('project', 'read'),
  ).toStrictEqual(['1', '5', '9', '10']);
});

test('get accessible ressources action wildcard', () => {
  expect(
    new PermissionsChecker([
      'project:*:1',
      'project:read:5',
      'project:*:9',
      'project:read:10',
    ]).getAccessibleRessources('project', 'write'),
  ).toStrictEqual(['1', '9']);
});

test('get accessible ressources itentifier wildcard', () => {
  expect(
    new PermissionsChecker(['project:read:*']).getAccessibleRessources(
      'project',
      'read',
    ),
  ).toStrictEqual(['*']);
});
