const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
    const token = req.header('x-auth-token');
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is missing in environment variables (Middleware)');
        return res.status(500).json({ message: 'Internal Server Configuration Error' });
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const admin = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

module.exports = { auth, admin };
