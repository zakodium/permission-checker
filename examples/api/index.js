import polka from 'polka';

import PermissionChecker from '../../src';

polka()
  .use((req, res, next) => {
    req.permissionChecker = new PermissionChecker([
      'project:read:1',
      'project:*:2',
      'project:*:3',
    ]);
    next();
  })
  .get('/projects/:id', (req, res) => {
    const allowed = req.permissionChecker.isAllowed(
      `project:read:${req.params.id}`,
    );
    res.end(
      `User is ${
        allowed === true ? 'allowed' : 'not allowd'
      } to access project ${req.params.id}`,
    );
  })
  .listen(3000, (err) => {
    if (err) throw err;
    console.log('> Running on localhost:3000');
    console.log('> Try accessing http://localhost:3000/projects/2');
    console.log('> Try accessing http://localhost:3000/projects/5');
  });
