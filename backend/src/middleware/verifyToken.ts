import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  email?: string;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .json({ message: "アクセストークンはありません。" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(400).json({ message: "有効でないトークンです。" });
        } else {
          req.email = decoded.email;
          next();
        }
      }
    );
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
};

export default verifyToken;
