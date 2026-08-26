import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const createBOQ = async (req, res, next) => {
  try {
    const { Order_Id, Items } = req.body;
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    const existingBOQ = await prisma.boqs.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (existingBOQ) {
      createError(400, "BOQ already exists");
    }
    const boqItems = Items.map((item) => {
      const quantity = Number(item.Quantity);
      const unitPrice = Number(item.Unit_Price);
      return {
        Name: item.Name,
        Description: item.Description || null,
        Quantity: quantity,
        Unit: item.Unit,
        Unit_Price: unitPrice,
        Total_Price: quantity * unitPrice
      };
    });
    const totalAmount = boqItems.reduce((sum, item) => sum + item.Total_Price, 0);
    const boq = await prisma.boqs.create({
      data: {
        Order_Id: Number(Order_Id),
        Total_Amount: totalAmount,
        Items: {
          create: boqItems
        }
      },
      include: {
        Items: true
      }
    });
    res.json({ message: "Create BOQ Success", result: boq });
  } catch (err) {
    next(err);
  }
};

export const getBOQByOrder = async (req, res, next) => {
  try {
    const { Order_Id } = req.params;
    const boq = await prisma.boqs.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      },
      include: {
        Items: {
          orderBy: {
            BOQ_Item_Id: "asc"
          }
        }
      }
    });
    if (!boq) {
      createError(404, "BOQ not found");
    }
    res.json({ result: boq });
  } catch (err) {
    next(err);
  }
};

export const updateBOQ = async (req, res, next) => {
  try {
    const { BOQ_Id } = req.params;
    const { Items } = req.body;
    const boq = await prisma.boqs.findUnique({
      where: {
        BOQ_Id: Number(BOQ_Id)
      }
    });
    if (!boq) {
      createError(404, "BOQ not found");
    }
    const boqItems = Items.map((item) => {
      const quantity = Number(item.Quantity);
      const unitPrice = Number(item.Unit_Price);
      return {
        Name: item.Name,
        Description: item.Description || null,
        Quantity: quantity,
        Unit: item.Unit,
        Unit_Price: unitPrice,
        Total_Price: quantity * unitPrice
      };
    });
    const totalAmount = boqItems.reduce((sum, item) => sum + item.Total_Price, 0);
    await prisma.boq_items.deleteMany({
      where: {
        BOQ_Id: Number(BOQ_Id)
      }
    });
    const result = await prisma.boqs.update({
      where: {
        BOQ_Id: Number(BOQ_Id)
      },
      data: {
        Total_Amount: totalAmount,
        Items: {
          create: boqItems
        }
      },
      include: {
        Items: true
      }
    });
    res.json({ message: "Update BOQ Success", result });
  } catch (err) {
    next(err);
  }
};