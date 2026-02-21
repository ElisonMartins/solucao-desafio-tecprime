import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (name: string, email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      cart: {
        create: {},
      },
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Usuário não encontrado");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("E-mail ou senha inválidos");

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,      
      email: user.email,    
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return token;
};
