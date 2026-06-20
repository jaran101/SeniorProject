import jwt from "jsonwebtoken"
import createError from "../utils/createError.js"
export const verifytoken=(req,res,next)=>{
  const token=req.headers["authorization"]
  if(!token){
    return createError(401,"Please enter the token")
  }
  jwt.verify(token,process.env.SECRET,(err,decode)=>{
    if(err){
      createError(403,"token invalided")
    }
    next()
  })
}