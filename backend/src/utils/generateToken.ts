import jwt from "jsonwebtoken";

const generateToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export { generateToken, generateRefreshToken };
