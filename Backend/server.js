import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoute from "./routes/auth.route.js"
import profileRoute from "./routes/profile.route.js"
import serviceRoute from "./routes/service.route.js"
import orderRoute from "./routes/order.route.js"
import reviewRoute from "./routes/review.route.js"
import chatRoute from "./routes/chat.route.js"
import helmet from 'helmet'
import { createServer } from "http";
import { Server } from "socket.io";
import { chatSocket }from "./socket/chat.socket.js";
const app =express()
const server =createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: "*",
    }
  }
);
chatSocket(io);
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"]
//     }
//   }
// }));
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/uploads',express.static('uploads'))
app.use('/api',authRoute)
app.use('/api',profileRoute)
app.use("/api", serviceRoute);
app.use("/api",orderRoute)
app.use("/api",reviewRoute)
app.use("/api",chatRoute)
app.use((err,req,res,next)=>{
  res.status(err.code||500).json({msg:err.message||"server error"})
})
const port =3000
server.listen(port,()=>{console.log(`start with port ${port}`)})