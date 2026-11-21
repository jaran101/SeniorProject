
import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
import fs from "fs";

export const uploadPaymentSlip = async (req, res, next) => {
  let uploadSuccess = false;
  try {
    const { Order_Id, Users_Id } = req.body;
    if (!Order_Id || !Users_Id) {
      createError(400, "Order_Id and Users_Id are required");
    }
    if (!req.file) {
      createError(400, "Slip file is required");
    }
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    if (order.Users_Id !== Number(Users_Id)) {
      createError(403, "You are not the owner of this order");
    }
    if (order.Status !== "COMPLETED") {
      createError(400, "Order is not completed");
    }
    if (order.Final_Price === null || order.Final_Price === undefined) {
      createError(400, "Order price not found");
    }
    const payment = await prisma.payments.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (payment && payment.Status === "PAID") {
      createError(400, "Payment has already been completed");
    }
    if (payment && payment.Status === "WAITING_CONFIRMATION") {
      createError(400, "Payment is waiting for confirmation");
    }
    const oldSlip = payment?.Slip_Image;
    const result = payment
      ? await prisma.payments.update({
        where: {
          Order_Id: Number(Order_Id)
        },
        data: {
          Amount: order.Final_Price,
          Slip_Image: `slips/${req.file.filename}`,
          Status: "WAITING_CONFIRMATION",
          Reject_Reason: null
        }
      })
      : await prisma.payments.create({
        data: {
          Order_Id: Number(Order_Id),
          Amount: order.Final_Price,
          Slip_Image: `slips/${req.file.filename}`,
          Status: "WAITING_CONFIRMATION"
        }
      });
    uploadSuccess = true;
    if (oldSlip) {
      const oldPath = `uploads/${oldSlip}`;
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error("Cannot delete old slip:", err);
        }
      }
    }
    res.json({
      message: "Upload slip success", result
    });
  } catch (err) {
    if (!uploadSuccess && req.file) {
      const newPath = `uploads/slips/${req.file.filename}`;
      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }
    }
    next(err);
  }
};

export const getPaymentByOrderId = async (req, res, next) => {
  try {
    const { Order_Id } = req.params;
    const { Users_Id } = req.query;
    if (!Order_Id || !Users_Id) {
      createError(400, "Order_Id and Users_Id are required");
    }
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      },
      select: {
        Users_Id: true,
        Tech_Id: true,
        Payment: {
          select: {
            Payment_Id: true,
            Order_Id: true,
            Amount: true,
            Slip_Image: true,
            Status: true,
            Reject_Reason: true,
            Paid_At: true,
            Created_At: true,
            Updated_At: true
          }
        }
      }
    });

    if (!order) {
      createError(404, "Order not found");
    }
    if (order.Users_Id !== Number(Users_Id) &&order.Tech_Id !== Number(Users_Id)) {
      createError(403, "You do not have permission to view this payment");
    }
    if (!order.Payment) {
      createError(404, "Payment not found");
    }
    res.json({ result: order.Payment });
  } catch (err) {
    next(err);
  }
};

