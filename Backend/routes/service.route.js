import express from "express";

import {createService,getAllServices,getServiceById,updateService,deleteService,
searchServices,searchServiceByCategory,getMyServices} from "../controllers/service.controller.js";
import { verifytoken } from "../middleware/verifytoken.js";
import upload from "../middleware/upload.js";
import { validate, createServiceSchema } from "../utils/validate.js";
const route = express.Router();
route.post("/newservice",verifytoken,upload,validate(createServiceSchema),createService);
route.get("/listservice",getAllServices);
route.get("/searchservices",searchServices);
route.get("/searchservicebycategory/:category", searchServiceByCategory);
route.get("/readservice/:id",getServiceById);
route.get("/searchmyservice/:Users_Id",getMyServices);
route.patch("/updateservice",verifytoken,upload,updateService);
route.delete("/removeservice/:id",verifytoken,deleteService);

export default route;