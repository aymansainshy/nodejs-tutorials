const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // Extract Token from incoming request ..
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;

    try {
        // Varify if its the right Token that created by JWT and decoded it.
        decodedToken = jwt.verify(token, 'Secret');

    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    // If its not valid token Throw an error.
    if (!decodedToken) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }

    // Extract UserId that stored in TOKEN
    req.userId = decodedToken.userId;
    console.log(req.userId);
    next();
}; 