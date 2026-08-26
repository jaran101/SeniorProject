import express from "express";
import {validate,addressSchema} from "../utils/validate.js";
import {createAddress,getMyAddresses,getAddressById,updateAddress,deleteAddress
} from "../controllers/address.controller.js";
const router = express.Router();
router.post("/newaddress",validate(addressSchema),createAddress);
router.get("/readmyaddresses/:Users_Id",getMyAddresses);
router.get("/readaddressbyId/:id",getAddressById);
router.put("/updateaddress/:id",validate(addressSchema),updateAddress);
router.delete("/removeaddress/:id",deleteAddress);

export default router;