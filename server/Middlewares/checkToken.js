import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../Models/User.js';

dotenv.config();
const checkToken = async (req, res, next) => {
  const authorization = req.headers.authorization || req.params.token;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      error: 'Token not provided',
    });
  }
  try {
    const verified = jwt.verify(authorization, process.env.secret);
    req.tokenData = verified;
    const userFound = await User.findById({ _id: req.tokenData._id });
    if (!userFound) {
      return res.status(403).json({
        status: 403,
        error: 'You are not authorized to perform this task',
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: error.message,
    });
  }
};
export default checkToken;
