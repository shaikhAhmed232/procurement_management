// middlewares/authorize.js
const { ROLE_PERMISSIONS } = require('../lib/constants');
const { UnAuthorizedError, ForbiddenError } = require('../lib/errors');

function authorize(options={}) {
  
  return async (req, res, next) => {
    try {
      if (!req.user) throw new UnAuthorizedError('Authentication required');
      
      const userRole = req.user.role;

      const currentRoute = `${req.method.toLowerCase()}:${req.baseUrl}${req.path ? req.path : ''}`;

      const permissions = ROLE_PERMISSIONS[userRole]
      if (!Array.isArray(permissions)) permissions = [permissions];
      // const granted = ROLE_PERMISSIONS[userRole] || [];

      // check static permission(s)
      const hasPerm = permissions.some((value) => value.test(currentRoute)); 
      if (!hasPerm) {
        throw new ForbiddenError('Forbidden: insufficient privileges');
      }
      if (options.policy) {
        if (!Array.isArray(options.policy)) options.policy = [options.policy];
          for (let each of options.policy) {
            each(req);
          }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}


module.exports = authorize;
