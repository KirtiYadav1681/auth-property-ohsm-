const jwt = require('jsonwebtoken');

const User = require('../model/User'); // user model

// autheticate user middleware
module.exports.authenticateUser = async (req, res, next) => {
  try {
    // Accessing the token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    // Finding the user based on the decoded user ID
    const user = await User.findById(decoded.userId);
    // if user is not found, then throw an error
    if (!user) { throw new Error("User not found or invalid token.");}
    // Attaching the user to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Authentication failed' });
  }
};

