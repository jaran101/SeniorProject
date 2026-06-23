import prisma from "../config/prisma.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected");
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    }
    );
    socket.on("send_message", async (data) => {
      try {
        let orderId = data.Order_Id ? Number(data.Order_Id) : null;
        if (data.Type === "PRICE_OFFER"||"IMAGE") {
          io.to(data.Room_Id).emit("receive_message", data);
          return;
        }
        const chat = await prisma.chats.create({
          data: {
            Service_Id: Number(data.Service_Id),
            Room_Id: data.Room_Id,
            Order_Id: orderId,
            Sender_Id: Number(data.Sender_Id),
            Receiver_Id: Number(data.Receiver_Id),
            Type: data.Type || "MESSAGE",
            Message: data.Message || null,
            Image: data.Image || null,
            Price: data.Price ? Number(data.Price) : null,
            Work_Date: data.Work_Date ? new Date(data.Work_Date) : null
          }
        });
        io.to(data.Room_Id).emit("receive_message", chat);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", () => {
      console.log("User Disconnected");
    }
    );
  }
  );
};