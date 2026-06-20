import express from "express";
import multer from "../middleware/upload.js";
import { verifytoken } from "../middleware/verifytoken.js";
import {validate,updateemailcheema} from "../utils/validate.js";
import {createProfile,upProfile,getProfileById,updateProfile,updateEmail,updatePassword,
  updateRole,updateStatus,getAllUser,getUserById,getUserByEmail,amountUser
} from "../controllers/profile.controller.js";
const route = express.Router();
route.post("/newprofile", verifytoken, createProfile);
route.post("/uploadprofile", verifytoken, multer, upProfile);
route.patch("/updateprofile", verifytoken, multer, updateProfile);
route.get("/readprofile/:id", verifytoken, getProfileById);
route.get("/listuser", getAllUser);
route.get("/readuser/:user_id", getUserById);
route.get("/readuserbyemail/:email", getUserByEmail);
route.get("/amountuser", amountUser);
route.patch("/updateemail",verifytoken,validate(updateemailcheema),updateEmail);
route.patch("/updatepassword", verifytoken,updatePassword);
route.patch("/updaterole",verifytoken,updateRole);
route.patch("/updatestatus",verifytoken,updateStatus);

export default route;