import express from "express";
import { verifytoken } from "../middleware/verifytoken.js";
import {createOrder,getAllOrders,getOrderById,updateOrderStatus,deleteOrder,
startOrder,finishOrder,confirmOrder,rejectOrder} from "../controllers/order.controller.js";

const route = express.Router();
route.post("/createorder",verifytoken,createOrder);
route.get("/listorder", getAllOrders);
route.get("/readorder/:id", getOrderById);
route.patch("/updateorder/:id",verifytoken, updateOrderStatus);
route.delete("/removeorder/:id",verifytoken, deleteOrder);
route.patch("/startorders/:id",verifytoken,startOrder);
route.patch("/finishorders/:id",verifytoken,finishOrder);
route.patch("/confirmorders/:id",verifytoken,confirmOrder);
route.patch("/rejectorders/:id",verifytoken,rejectOrder);
export default route;