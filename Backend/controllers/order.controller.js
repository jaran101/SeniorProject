import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const {Users_Id,Service_Id,offerPrice,workDate} = req.body;
    const service = await prisma.services.findUnique({
      where: {
        Service_Id: Number(Service_Id)
      }
    });
    if (!service) {
      createError(404, "Service not found");
    }
    const order = await prisma.orders.create({
      data: {
        Users_Id: Number(Users_Id),
        Service_Id: Number(Service_Id),
        Final_Price: Number(offerPrice),
        Work_Date: new Date(workDate)
      }
    });
    res.json({message: "Create Order Success",result: order});
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
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findUnique({
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
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(id)
      }
    });
    if (!order) {
      (404, "Order not found");
    }
    const result = await prisma.orders.update({
      where: {
        Order_Id: Number(id)
      },
      data: {
        Status
      }
    });
    res.json({ message: "Update Order Success", result });
  } catch (err) {
    next(err);
  }
};
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(id)
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    await prisma.orders.delete({
      where: {
        Order_Id: Number(id)
      }
    });
    res.json({message: "Delete Order Success"});
  } catch (err) {
    next(err);
  }
};
export const startOrder = async (req,res,next) => {
  try {
    const { id } = req.params;
    const result =await prisma.orders.update({
        where: {
          Order_Id: Number(id)
        },
        data: {
          Status: "IN_PROGRESS"
        }
      });
    res.json({message: "Start Order Success",result});
  } catch (err) {
    next(err);
  }
};
export const finishOrder = async (req,res,next) => {
  try {
    const { id } = req.params;
    const result =await prisma.orders.update({
        where: {
          Order_Id: Number(id)
        },
        data: {
          Status: "WAITING_CONFIRM"
        }
      });
    res.json({message: "Finish Order Success",result});
  } catch (err) {
    next(err);
  }
};
export const confirmOrder = async (req,res,next) => {
  try {
    const { id } = req.params;
    const result =await prisma.orders.update({
        where: {
          Order_Id: Number(id)
        },
        data: {
          Status: "COMPLETED"
        }
      });
    res.json({message: "Confirm Order Success",result});
  } catch (err) {
    next(err);
  }
};
export const rejectOrder = async (req,res,next) => {
  try {
    const { id } = req.params;
    const result =await prisma.orders.update({
        where: {
          Order_Id: Number(id)
        },
        data: {
          Status: "IN_PROGRESS"
        }
      });
    res.json({message: "Reject Order Success",result});
  } catch (err) {
    next(err);
  }
};

