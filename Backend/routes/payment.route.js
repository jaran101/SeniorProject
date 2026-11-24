
import express from "express";
import { verifytoken } from "../middleware/verifytoken.js";
import uploadSlip from "../middleware/uploadSlip.js";
import {uploadPaymentSlip,getPaymentByOrderId,updatePaymentStatus,createPayment} from "../controllers/payment.controller.js";

const route = express.Router();
route.post("/newpayment",  createPayment);
route.post("/uploadslip",verifytoken,uploadSlip,uploadPaymentSlip);
route.get("/readpayment/:Order_Id",verifytoken,getPaymentByOrderId);
route.patch("/paymentupdatestatus",verifytoken,updatePaymentStatus);
export default route; 
