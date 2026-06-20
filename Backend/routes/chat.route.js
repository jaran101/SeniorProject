import express from "express";

import {createMessage,getMessages,getMyRooms,readMessages,offerPrice
} from "../controllers/chat.controller.js";
import upload from "../middleware/upload.js";
import { verifytoken } from "../middleware/verifytoken.js";
const route = express.Router();

route.post("/newmessage",verifytoken,upload,createMessage);
route.get("/readmessages/:Room_Id",verifytoken,getMessages);
route.get("/listmyrooms/:Users_Id",verifytoken,getMyRooms);
route.patch("/statusreadmessages",verifytoken,readMessages);
route.post("/offer-price",verifytoken,offerPrice);
export default route;