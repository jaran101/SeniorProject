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
        io.to(data.Room_Id).emit("receive_message", chat);
      } catch (err) {
        throw err;
      }
    });
    socket.on("disconnect", () => {
      console.log("User Disconnected");
    }
    );
  }
  );
};