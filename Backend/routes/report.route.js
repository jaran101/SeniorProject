import express from "express";
import { createReport, getMyReports, getAllReports, updateReportStatus } from "../controllers/report.controller.js";
import { verifytoken } from "../middleware/verifytoken.js";

const router = express.Router();

router.post("/newreport", verifytoken, createReport);
router.get("/readmyreport/:Users_Id", verifytoken, getMyReports);
router.get("/listmyreport/:Users_Id", verifytoken, getAllReports);
router.patch("/updatereport/:Report_Id", verifytoken, updateReportStatus);
export default router;