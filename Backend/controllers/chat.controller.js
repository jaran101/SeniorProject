import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const createMessage = async (req, res, next) => {
  try {
    const { Service_Id, Room_Id, Order_Id, Sender_Id, Receiver_Id, Message, Price } = req.body;
    const chat = await prisma.chats.create({
      data: {
        Service_Id: Number(Service_Id),
        Room_Id,
        Sender_Id: Number(Sender_Id),
        Receiver_Id: Number(Receiver_Id),
        Type: req.file ? "IMAGE" : "MESSAGE",
        Message: Message || null,
        Image: req.file?.filename || null,
        Price: Price ? Number(Price) : null
      }
    });
    res.status(201).json({ message: "Send Message Success", result: chat });
  } catch (err) {
    next(err);
  }
};
export const getMessages = async (req, res, next) => {
  try {
    const { Room_Id } = req.params;
    const chats = await prisma.chats.findMany({
      where: { Room_Id },
      orderBy: { Created_At: "asc" }
    });
    res.json({ result: chats });
  }
  catch (err) {
    next(err);
  }
};
export const getMyRooms = async (req, res, next) => {
  try {
    const { Users_Id } = req.params;
    const rooms = await prisma.chats.findMany({
      where: {
        OR: [
          { Sender_Id: Number(Users_Id) },
          { Receiver_Id: Number(Users_Id) }
        ]
      },
      distinct: ["Room_Id"],
      orderBy: { Created_At: "desc" }
    });
    res.json({ result: rooms });
  } catch (err) {
    next(err);
  }
};
export const offerPrice = async (req, res, next) => {
  try {
    const { Service_Id, Room_Id, Sender_Id, Receiver_Id, Price, Message, Work_Date, Work_Date_End } = req.body;
    const offer = await prisma.chats.create({
      data: {
        Service_Id: Number(Service_Id),
        Room_Id,
        Sender_Id: Number(Sender_Id),
        Receiver_Id: Number(Receiver_Id),
        Work_Date: new Date(Work_Date),
        Work_Date_End: new Date(Work_Date_End),
        Type: "PRICE_OFFER",
        Price: Number(Price),
        Message: Message || "เสนอราคา"
      }
    });
    res.json({ message: "Offer Price Success", result: offer });
  } catch (err) {
    next(err);
  }
};
export const rejectOfferPrice = async (req, res, next) => {
  try {
    const { Chat_Id } = req.body
    await prisma.chats.update({
      where: { Chat_Id },
      data: {
        Type: "PRICE_REJECT"
      }
    })
    res.json({message:"Price Reject Success"})
  } catch (err) {
    next(err);
  }
}