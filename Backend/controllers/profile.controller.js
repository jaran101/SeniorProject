import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import fs from "fs";

export const createProfile = async (req, res, next) => {
  try {
    const {Users_Id,First_Name,Last_Name,Phone,Gender,Birth_Date,Address,} = req.body;
    if (!Users_Id) {
      createError(400, "Users_Id is required");
    }
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const profileExists = await prisma.profiles.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (profileExists) {
      createError(400, "Profile already exists");
    }
    const profile = await prisma.profiles.create({
      data: {
        Users_Id: Number(Users_Id),
        First_Name,
        Last_Name,
        Phone,
        Gender,
        Birth_Date: Birth_Date ? new Date(Birth_Date) : null,
        Address
      }
    });

    res.json({result:profile});
  } catch (err) {
    next(err);
  }
};

export const upProfile = async (req, res, next) => {
  try {
    const { Users_Id } = req.body;
    if (!req.file) {
      createError(400, "Avatar file is required");
    }
    await prisma.profiles.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Avatar: req.file.filename
      }
    });
    res.json({message: "Upload avatar success"});
  } catch (err) {
    next(err);
  }
};

export const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profiles.findUnique({
      where: {
        Users_Id: Number(id)
      }
    });
    if (!profile) {
      createError(400, "Profile not found");
    }
    res.json({result:profile});
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {Users_Id,First_Name,Last_Name,Phone,Gender,Birth_Date,Address} = req.body;
    let Avatar
    const profile = await prisma.profiles.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!profile) {
      createError(400, "Profile not found");
    }
    if (req.file) {
          if (profile.Avatar) {
            if (fs.existsSync(`uploads/${profile.Avatar}`)) {
              fs.unlinkSync(`uploads/${profile.Avatar}`);
            }
          }
          Avatar= req.file.filename;
        }
    const result = await prisma.profiles.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Users_Id: Number(Users_Id),
        First_Name,
        Last_Name,
        Phone,
        Gender,
        Birth_Date: Birth_Date ? new Date(Birth_Date) : null,
        Address,
        Avatar
      }
    });
    res.json({message:"update profile success",result});
  } catch (err) {
    next(err);
  }
};

export const updateEmail = async (req, res, next) => {
  try {
    const { Users_Id, Email } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    await prisma.users.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Email
      }
    });
    res.json({message: "update email success"});
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { Users_Id, Password } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const hashPassword = bcrypt.hashSync(Password, 10);
    await prisma.users.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Password: hashPassword
      }
    });
    res.json({message: "update password success"});
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { Users_Id, Role } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const result=await prisma.users.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Role
      }
    });
    res.json({message: "update role success",result});
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { Users_Id, Status } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const result=await prisma.users.update({
      where: {
        Users_Id: Number(Users_Id)
      },
      data: {
        Status
      }
    });

    res.json({message: "update status success",result});
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        Profile: true
      }
    });
    res.json({result:users});
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(user_id)
      },
      include: {
        Profile: true
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    res.json({result:user});
  } catch (err) {
    next(err);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        Email: email
      },
      include: {
        Profile: true
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    res.json({result:user});
  } catch (err) {
    next(err);
  }
};

export const amountUser = async (req, res, next) => {
  try {
    const count = await prisma.users.count();
    res.json({result: count});
  } catch (err) {
    next(err);
  }
};