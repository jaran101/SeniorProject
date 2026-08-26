import express from "express";
import {createBOQ,getBOQByOrder,updateBOQ} from "../controllers/boq.controller.js";
const router = express.Router();

router.post("/newboq", createBOQ);
router.get("/readboqorder/:Order_Id", getBOQByOrder);
router.put("/updateboq/:BOQ_Id", updateBOQ);

export default router;