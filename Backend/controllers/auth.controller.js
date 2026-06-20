
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        Email: Email
      }
    });
    if (user) {
      createError(400, "Email already exists");
    }
    const hashPassword = bcrypt.hashSync(Password, 10);
    await prisma.users.create({
      data: {
        Email,
        Password: hashPassword,
        Role: "USER",
        Status: "ACTIVE"
      }
    });
    res.json({message: "Register Success"});
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        Email
      }
    });
    if (!user) {
      createError(400, "Email or Password is Invalid")
    }
    const checkPassword = bcrypt.compareSync(Password,user.Password);
    if (!checkPassword) {
      createError(400, "Email or Password is Invalid")
    }
    if (user.Status !== "ACTIVE") {
      createError(403, "Account is not active")
    }
    const payload = {
      id: user.Users_Id,
      email: user.Email,
      role: user.Role,
      status: user.Status
    };
    const token = jwt.sign(payload,process.env.SECRET,{expiresIn: "5h"});
    res.json({message: "Login Success",payload,token});
  } catch (err) {
    next(err);
  }
};
