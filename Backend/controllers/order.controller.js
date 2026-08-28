import { ChatType, Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const { Users_Id,Tech_Id, Service_Id, Final_Price, Work_Date, Work_Date_End, Chat_Id } = req.body;
    await prisma.chats.update({
      where: { Chat_Id },
      data: {
        Type: "PRICE_ACCEPT"
      }
    })
    const userorder = await prisma.orders.create({
      data: {
        Tech_Id:Number(Tech_Id),
        Users_Id: Number(Users_Id),
        Service_Id: Number(Service_Id),
        Final_Price: Number(Final_Price),
        Work_Date: new Date(Work_Date),
        Work_Date_End: new Date(Work_Date_End),
        Status: "ACCEPTED"
      }
    });
    res.json({ message: "Create Order Success", result:userorder});
  } catch (err) {
    next(err);
  }
};
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        User: true,
        Service: true
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({ result: orders });
  } catch (err) {
    next(err);
  }
};
export const getOrderByIdOder= async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findMany({
      where: {
        Order_Id: Number(id)
      },
      include: {
        User: true,
        Service: true
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    res.json({ result: order });
  } catch (err) {
    next(err);
  }
};
export const getOrderByIdTech = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findMany({
      where: {
        Tech_Id: Number(id)
      },
      include: {
        User: true,
        Service: true
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    res.json({ result: order });
  } catch (err) {
    next(err);
  }
};
export const getOrderByIdService= async (req, res, next) => {
  try {
    const { Service_Id } = req.params;
    const service = await prisma.services.findMany({
      where: {
        Service_Id:Number(Service_Id)
      }
    });
    if (!service) {
      createError(404, "Service not found");
    }
    const order =await prisma.orders.findMany({
      where:{
        Service:{
            Service_Id:Number(Service_Id)
        }
      }
    })
    res.json({ result: order });
  } catch (err) {
    next(err);
  }
};
export const startOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.orders.update({
      where: {
        Order_Id: Number(id)
      },
      data: {
        Status: "IN_PROGRESS"
      }
    });
    res.json({ message: "Start Order Success", result });
  } catch (err) {
    next(err);
  }
};
export const finishOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.orders.update({
      where: {
        Order_Id: Number(id)
      },
      data: {
        Status: "WAITING_CONFIRM"
      }
    });
    res.json({ message: "Finish Order Success", result });
  } catch (err) {
    next(err);
  }
};
export const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.orders.update({
      where: {
        Order_Id: Number(id)
      },
      data: {
        Status: "COMPLETED"
      }
    });
    res.json({ message: "Confirm Order Success", result });
  } catch (err) {
    next(err);
  }
};
export const rejectOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.orders.update({
      where: {
        Order_Id: Number(id)
      },
      data: {
        Status: "IN_PROGRESS"
      }
    });
    res.json({ message: "Reject Order Success", result });
  } catch (err) {
    next(err);
  }
};
export const getMyOder=async (req,res,next)=>{
  const {id}=req.params
  const orders=await prisma.orders.findMany({
    where:{
      Users_Id:Number(id)
    }
  })
  res.json({ message: "Reject Order Success", result:orders});
};
