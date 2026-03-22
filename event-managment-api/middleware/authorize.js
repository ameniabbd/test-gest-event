// middleware/authorize.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès interdit. Vous n\'avez pas les droits nécessaires.',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = authorize;