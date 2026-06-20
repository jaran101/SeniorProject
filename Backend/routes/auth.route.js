import express from "express"
import {register,login} from "../controllers/auth.controller.js"
import {validate,registerscheema,loginscheema} from "../utils/validate.js"
import { verifytoken } from "../middleware/verifytoken.js"
import {loginLimiter} from "../utils/rateLimit.js"
const route =express.Router()
route.post('/auth',verifytoken,(req,res)=>res.json({msg:"WELLCOME TO DASHBOARD"}))
route.post('/register',validate(registerscheema),register)
route.post('/login',validate(loginscheema),loginLimiter,login)

export default route