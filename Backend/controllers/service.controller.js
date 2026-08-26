import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
import fs from "fs";

export const createService = async (req, res, next) => {
  try {
    const { Users_Id, Title, Category, Description, Price } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const service = await prisma.services.create({
      data: {
        Users_Id: Number(Users_Id),
        Title: Title,
        Category: Category,
        Description: Description || null,
        Price: Number(Price),
        Image: req.file?.filename || null
      }
    });
    res.status(201).json({ message: "Service created successfully.", result: service });
  } catch (err) {
    next(err);
  }
};
export const getAllServices = async (req, res, next) => {
  try {
    const services = await prisma.services.findMany({
      include: {
        User: {
          select: {
            Users_Id: true,
            Email: true,
            Role: true,
            Profile: {
              select: {
                First_Name: true,
                Last_Name: true,
                Avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({ result: services });
  } catch (err) {
    next(err);
  }
};
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await prisma.services.findUnique({
      where: {
        Service_Id: Number(id)
      },
      include: {
        User: {
          select: {
            Users_Id: true,
            Email: true,
            Role: true,
            Profile: true
          }
        }
      }
    });
    if (!service) {
      createError(404, "Service not found");
    }
    res.json({ result: service });
  } catch (err) {
    next(err);
  }
};
export const updateService = async (req, res, next) => {
  try {
    const { Service_Id, Title, Category, Description, Price, Users_Id } = req.body;
    let Image
    const service = await prisma.services.findUnique({
      where: {
        Service_Id: Number(Service_Id)
      }
    });
    if (!service) {
      createError(404, "Service not found");
    }
    if (service.Users_Id !== Number(req.body.Users_Id)) {
      createError(403, "Access Denied");
    }
    if (req.file) {
      if (service.Image) {
        if (fs.existsSync(`uploads/${service.Image}`)) {
          fs.unlinkSync(`uploads/${service.Image}`);
        }
      }
      Image = req.file.filename;
    }
    const result = await prisma.services.update({
      where: {
        Service_Id: Number(Service_Id)
      },
      data: {
        Title: Title ? Title : undefined,
        Category: Category ? Category : undefined,
        Description,
        Price: Price ? Number(Price) : undefined,
        Image
      }
    });
    res.json({ message: "Update Service Success", result });
  } catch (err) {
    next(err);
  }
};
export const deleteService = async (req, res, next) => {

  try {
    const { id } = req.params;
    const service = await prisma.services.findUnique({
      where: {
        Service_Id: Number(id)
      }
    });
    if (!service) {
      createError(404, "Service not found");
    }
    if (service.Users_Id !== Number(req.body.Users_Id)) {
      createError(403, "Access Denied");
    }
    if (service.Image) {
      if (fs.existsSync(`uploads/${service.Image}`)) {
        fs.unlinkSync(`uploads/${service.Image}`);
      }
    }
    await prisma.services.delete({
      where: {
        Service_Id: Number(id)
      }
    });
    res.json({ message: "Delete Service Success" });
  } catch (err) {
    next(err);
  }
};
export const searchServices = async (req, res, next) => {
  try {
    const { q, Category, Province} = req.query;
    const where = {};
    if (q) {
      where.OR = [
        { Title: { contains: q } },
        { Description: { contains: q } }
      ];
    }
    if (Category) {
      where.Category = Category;
    }
    if (Province ) {
      where.User = {
        ServiceAreas: {
          some: {
            Province: Province
          }
        }
      };
    }
    const services = await prisma.services.findMany({
      where,
      include: {
        User: {
          select: {
            Users_Id: true,
            Email: true,
            Profile: {
              select: {
                First_Name: true,
                Last_Name: true,
                Avatar: true,
                Phone: true
              }
            },
            ServiceAreas: true 
          }
        }
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({ result: services });
  } catch (err) {
    next(err);
  }
};
export const getMyServices = async (req, res, next) => {
  try {
    const { Users_Id } = req.params;
    const services = await prisma.services.findMany({
      where: {
        Users_Id: Number(Users_Id)
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({ result: services });
  } catch (err) {
    next(err);
  }
};
export const createServiceArea = async (req, res, next) => {
  try {
    const {Users_Id,Province,District} = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    const area = await prisma.service_areas.create({
      data: {
        Users_Id: Number(Users_Id),
        Province,
        District
      }
    });
    res.json({message: "Create Service Area Success",result: area});
  } catch (err) {
    next(err);
  }
};
export const deleteServiceArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await prisma.service_areas.findUnique({
      where: {
        Area_Id: Number(id)
      }
    });
    if (!area) {
      createError(404, "Area not found");
    }
    await prisma.service_areas.delete({
      where: {
        Area_Id: Number(id)
      }
    });
    res.json({message: "Delete Success"});
  } catch (err) {
    next(err);
  }
};