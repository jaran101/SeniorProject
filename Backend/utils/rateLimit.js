import rateLimit from "express-rate-limit"
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "You have attempted to log in too many times. Please wait 15 minutes and try again",
  headers: true,
});