import express from "express";
import { verifytoken } from "../middleware/verifytoken.js";
import {createOrder,getAllOrders,getOrderByIdUser,updateOrderStatus,deleteOrder,
startOrder,finishOrder,confirmOrder,rejectOrder,getMyOder,getOrderByIdTech} from "../controllers/order.controller.js";

const route = express.Router();
route.post("/createorder",verifytoken,createOrder);
route.get("/listorder", getAllOrders);
route.get("/readuserorder/:id", getOrderByIdUser);
route.get("/readtechorder/:id", getOrderByIdTech);
route.patch("/updateorder/:id",verifytoken, updateOrderStatus);
route.delete("/removeorder/:id",verifytoken, deleteOrder);
route.patch("/startorders/:id",verifytoken,startOrder);
route.patch("/finishorders/:id",verifytoken,finishOrder);
route.patch("/confirmorders/:id",verifytoken,confirmOrder);
route.patch("/rejectorders/:id",verifytoken,rejectOrder);
route.get("/readorderbyuserid/:id",getMyOder)
export default route;