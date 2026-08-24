import express from "express";

import {getProvinces,getDistricts,getSubdistricts} from "../controllers/location.controller.js";

const router = express.Router();
router.get("/readprovinces", getProvinces);
router.get("/readdistricts/:provinceId", getDistricts);
router.get("/readsubdistricts/:districtId", getSubdistricts);

export default router;