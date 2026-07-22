import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    const socket = io("http://localhost:3000");


    setSocket(socket);


    socket.on("connect", () => {
      console.log("Socket connected : ", socket.id);
    });

    return () => socket.disconnect();
  }, []);

  return socket;
}