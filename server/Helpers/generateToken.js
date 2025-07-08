import jwt from 'jsonwebtoken';

const generateToken = (_id, name, role = null) =>
  jwt.sign(
    {
      _id,
      name,
      role,
    },
    process.env.secret
  );
export default generateToken;
