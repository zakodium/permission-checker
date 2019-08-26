import polka from 'polka';

import PermissionChecker from '../../src';

polka()
  .use(
    (req, res, next) => {
      req.permissionChecker = new PermissionChecker([
        'projects:read:1',
        'projects:*:2',
        'projects:*:3',
      ]);
      next();
    },
    (req, res, next) => {
      const allowed = req.permissionChecker.isAllowed(
        `${req.params.ressource}:read:${req.params.id || '*'}`,
      );
      if (!allowed) {
        res.end(
          `User is not allowed to access ${req.params.ressource}/${req.params.id}`,
        );
      } else {
        next();
      }
    },
  )
  .get('/:ressource/:id', (req, res) => {
    res.end(
      `User is allowed to access ${req.params.ressource}/${req.params.id}`,
    );
  })
  .listen(3000, (err) => {
    if (err) throw err;
    console.log('> Running on localhost:3000');
    console.log('> Try accessing http://localhost:3000/project/2');
    console.log('> Try accessing http://localhost:3000/project/5');
  });
