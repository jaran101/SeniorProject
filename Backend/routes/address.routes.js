import express from "express";

import {createAddress,getMyAddresses,getAddressById,updateAddress,deleteAddress
} from "../controllers/address.controller.js";
const router = express.Router();
router.post("/newaddress",createAddress);
router.get("/readmyaddresses/:Users_Id",getMyAddresses);
router.get("/readaddressbyId/:id",getAddressById);
router.put("/updateaddress/:id",updateAddress);
router.delete("/removeaddress/:id",deleteAddress);

export default router;