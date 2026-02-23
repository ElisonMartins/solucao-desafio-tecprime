import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../lib/logger";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  logger.info({ email }, "Register attempt started");

  try {
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

    logger.info({ userId: user.id, email }, "User registered successfully");

    return user;
  } catch (error) {
    logger.error(
      { email, error },
      "Error occurred during user registration"
    );
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  logger.info({ email }, "Login attempt started");

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn({ email }, "Login failed - user not found");
      throw new Error("Usuário não encontrado");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      logger.warn({ userId: user.id }, "Login failed - invalid credentials");
      throw new Error("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    logger.info({ userId: user.id }, "User logged in successfully");

    return token;
  } catch (error) {
    logger.error({ email, error }, "Error occurred during login");
    throw error;
  }
};
