import rateLimit from "express-rate-limit"
import createError from "./createError.js"
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  headers: true,
  handler:(req,res,next)=>{
    next(createError(429,"You have attempted to log in too many times. Please wait 15 minutes and try again"))
  }
});