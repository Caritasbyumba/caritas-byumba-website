import generateToken from '../Helpers/generateToken.js';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import User from '../Models/User.js';
import hashPassword from './../Helpers/hashPassword.js';
import checkPassword from './../Helpers/checkPassword.js';

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      return errorResponse(res, 409, 'User with this email already exists');
    }
    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword(password),
    });
    const user = await newUser.save();
    const token = generateToken(user._id, user.name, user.role);
    return successResponse(res, 201, 'User created', { token, ...user._doc });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email: email });
    if (userFound && checkPassword(password, userFound.password)) {
      const token = generateToken(
        userFound._id,
        userFound.name,
        userFound.role
      );
      return successResponse(res, 200, 'User logged in', {
        token,
        ...userFound._doc,
      });
    }
    return errorResponse(res, 401, 'Invalid email/password');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
