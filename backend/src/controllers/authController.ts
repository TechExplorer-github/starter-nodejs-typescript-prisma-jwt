import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import prisma from "../utils/db";
import generateToken from "../utils/generateToken";

interface AuthRequest extends Request {
  email?: string;
}

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
  res.cookie("token", token, { httpOnly: true });

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
  res.cookie("token", token, { httpOnly: true });

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
  res.clearCookie("token");
  res.status(200).json({ message: "Cookiesを削除しました。" });
};

export { signup, login, user, logout };
