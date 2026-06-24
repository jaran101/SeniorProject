import express from "express";

import {createMessage,getMessages,getMyRooms,offerPrice,rejectOfferPrice
} from "../controllers/chat.controller.js";
import upload from "../middleware/upload.js";
import { verifytoken } from "../middleware/verifytoken.js";
const route = express.Router();

route.post("/newmessage",verifytoken,upload,createMessage);
route.get("/readmessages/:Room_Id",verifytoken,getMessages);
route.get("/listmyrooms/:Users_Id",verifytoken,getMyRooms);
route.post("/offer-price",verifytoken,offerPrice);
route.patch("/rejectPrice",rejectOfferPrice)
export default route;