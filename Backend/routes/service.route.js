import express from "express";
import {createService,getAllServices,getServiceById,updateService,deleteService,
searchServices,getMyServices,createServiceArea,deleteServiceArea,
updateServiceArea,getMyServiceArea} from "../controllers/service.controller.js";
import { verifytoken } from "../middleware/verifytoken.js";
import upload from "../middleware/upload.js";
import { validate, createServiceSchema } from "../utils/validate.js";
const route = express.Router();
route.post("/newservice",verifytoken,upload,validate(createServiceSchema),createService);
route.get("/listservice",getAllServices);
route.get("/searchservices",searchServices);
route.get("/readservice/:id",getServiceById);
route.get("/searchmyservice/:Users_Id",getMyServices);
route.patch("/updateservice",verifytoken,upload,updateService);
route.delete("/removeservice/:id",verifytoken,deleteService);
route.post("/newservicearea",createServiceArea)
route.delete("/removeservicearea/:id",deleteServiceArea)
route.get("/readmyservicearea/:Users_Id", getMyServiceArea);
route.put("/updateservicearea", updateServiceArea);
export default route;