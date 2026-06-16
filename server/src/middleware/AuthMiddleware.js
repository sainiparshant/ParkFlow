import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  }catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
    return res.status(403).json({
        message: "Access denied"
    });
    }
    next();
  };
}

export { isAuthenticated, authorizeRoles };