import polka from 'polka';

import PermissionChecker from '../../src';

const methodPerms = {
  GET: 'read',
  HEAD: 'read',
  POST: 'write',
  PUT: 'write',
  DELETE: 'delete',
  PATCH: 'write',
  OPTIONS: 'write',
};

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
      if (Object.keys(methodPerms).includes(req.method) === false) {
        return res.end(`Method '${req.method}' not handled by permissions`);
      }
      if (!req.params) {
        res.statusCode = 404;
        return res.end("Can't deduct ressource");
      }

      const allowed = req.permissionChecker.isAllowed(
        `${req.params.ressource}:${methodPerms[req.method]}:${req.params.id ||
          '*'}`,
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
  .get('/api/:ressource/:id', (req, res) => {
    res.end(
      `User is allowed to access ${req.params.ressource}/${req.params.id}`,
    );
  })
  .listen(3000, (err) => {
    if (err) throw err;
    console.log('> Running on localhost:3000');
    console.log('> Try accessing http://localhost:3000/api/projects/2');
    console.log('> Try accessing http://localhost:3000/api/projects/5');
  });
