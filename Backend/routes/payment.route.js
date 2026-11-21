
import express from "express";
import { verifytoken } from "../middleware/verifytoken.js";
import uploadSlip from "../middleware/uploadSlip.js";
import {uploadPaymentSlip,getPaymentByOrderId} from "../controllers/payment.controller.js";

const route = express.Router();

route.post("/uploadslip",uploadSlip, uploadPaymentSlip);
route.get("/readpayment/:Order_Id", getPaymentByOrderId);

export default route; 
