import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/db";
import { generateToken, generateRefreshToken } from "../utils/generateToken";
import { AuthRequest } from "../interfaces/AuthRequest";
import { getExpirationTime } from "../utils/calcTime";

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const signupUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });

  const token = generateToken(signupUser.email);
  const refresh_token = generateRefreshToken(signupUser.email);
  const expirationTime = getExpirationTime();

  await prisma.token.create({
    data: {
      userId: signupUser.id,
      token: refresh_token,
      expirationTime: expirationTime,
    },
  });

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refresh_token", refresh_token, { httpOnly: true });

  return res
    .status(201)
    .json({ message: "ユーザが作成されました。", signupUser });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const loginUser = await prisma.user.findFirst({ where: { email: email } });
  if (!loginUser) {
    return res
      .status(400)
      .json({ message: "メールアドレスかパスワードに誤りがあります。" });
  }

  const match = await bcrypt.compare(password, loginUser.password);
  if (!match) {
    return res
      .status(400)
      .json({ message: "メールアドレスかパスワードに誤りがあります。" });
  }

  const token = generateToken(email);
  const refresh_token = generateRefreshToken(email);
  const expirationTime = getExpirationTime();

  await prisma.token.create({
    data: {
      userId: loginUser.id,
      token: refresh_token,
      expirationTime: expirationTime,
    },
  });

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refresh_token", refresh_token, { httpOnly: true });

  return res
    .status(200)
    .json({ message: "ログインに成功しました。", loginUser });
};

const user = async (req: AuthRequest, res: Response) => {
  const email = req.email;
  const user = await prisma.user.findFirst({
    where: { email: email },
    select: { name: true, email: true },
  });

  if (!user) {
    return res.status(404).json({ message: "ユーザは存在しません。" });
  }

  return res.status(200).json({ user });
};

const logout = async (req: Request, res: Response) => {
  // TODO: DBのリフレッシュトークンを削除
  res.clearCookie("token");
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Cookiesを削除しました。" });
};

const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.cookies;
  const now = new Date(Date.now());
  const tokyoExpirationDate = now.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const currentTime = new Date(tokyoExpirationDate);

  const token = await prisma.token.findFirst({
    where: {
      token: refresh_token,
      expirationTime: {
        gt: currentTime,
      },
    },
  });

  if (!token) {
    return res.status(401).json({ message: "有効でないトークンです。" });
  }

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET_KEY as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "有効でないトークンです。" });
      } else {
        const email = decoded.email;
        const token = generateToken(email);

        return res
          .status(201)
          .json({ message: "新しいアクセストークンを作成しました。", token });
      }
    }
  );
};

export { signup, login, user, logout, refreshToken };
