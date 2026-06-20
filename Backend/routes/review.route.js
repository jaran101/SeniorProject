import express from "express";

import {createReview,getAllReviews,getReviewById,updateReview,deleteReview,
getReviewsByService,getServiceRating} from "../controllers/review.controller.js";

const route = express.Router();
route.post("/createreview", createReview);
route.get("/listreview", getAllReviews);
route.get("/readreviewbyservice/:serviceId",getReviewsByService);
route.get("/readreview/:id", getReviewById);
route.patch("/updatereview/:id", updateReview);
route.delete("/removereview/:id", deleteReview);
route.get("/readreviewservicerating/:serviceId", getServiceRating);
export default route;