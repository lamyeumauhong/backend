const jwt = require('jsonwebtoken');


const authMiddleWare = (req, res, next) => {
    const tokenHeader = req.headers.token;
    if (!tokenHeader) {
        return res.status(401).json({
            message: 'Token not provided',
            status: 'ERROR'
        });
    }

    const token = tokenHeader.split(' ')[1];
    jwt.verify(token, 'access_token', function (err, user) {
        if (err || !user?.isAdmin) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }
        next();
    });
};

const authUserMiddleWare = (req, res, next) => {
    const tokenHeader = req.headers.token;
    if (!tokenHeader) {
        return res.status(401).json({
            message: 'Token not provided',
            status: 'ERROR'
        });
    }

    const token = tokenHeader.split(' ')[1];
    const userId = req.params.id;
    jwt.verify(token, 'access_token', function (err, user) {
        if (err || (!user?.isAdmin && user?.id !== userId)) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }
        next();
    });
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare
};
