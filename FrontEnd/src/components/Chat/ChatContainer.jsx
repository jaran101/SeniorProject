import { useState,useEffect } from "react";
import useSocket from "../hooks/useSocket";
import RoomList from "./RoomList";
import ChatRoom from "./ChatRoom";
import { useLocation } from "react-router-dom";
import "./ChatContainer.css"
import axios from "axios"; 

function getOtherUserId(room, currentUserId) {

  if(room.Sender_Id === currentUserId){
    return room.Receiver_Id
  }
else{
    return room.Sender_Id
  }
  
}

export default function ChatContainer() {
  const socket = useSocket();
  const location = useLocation();
  const [activeRoom , setActiveRoom]=useState(location.state||null)
  const [messages, setMessages] = useState([]); 
  const [roomsList, setRoomsList] = useState([]);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.payload?.id;
   const [showOfferModal, setShowOfferModal] = useState(false);
  const isTechnician = activeRoom && currentUserId === activeRoom.Receiver_Id;
function updateRoomLastMessage(newMessage) {
  setRoomsList(prev =>
    prev.map(room =>
      room.Room_Id === newMessage.Room_Id
        ? { ...room, Message: newMessage.Message, Type: newMessage.Type, Image: newMessage.Image }
        : room
    )
  );
}

  
useEffect(() => {


if (!activeRoom || !socket) return;

  socket.emit("join_room", activeRoom.Room_Id);
  console.log("Joined room:", activeRoom.Room_Id);


  }, [activeRoom, socket]);

 useEffect(() => {
  if(!socket){
    return;
  }

  function receive_message(newMessage){
    setMessages(prev => {
      const exists = prev.some(m => m.Chat_Id === newMessage.Chat_Id);
      if (exists) {
        return prev.map(m => m.Chat_Id === newMessage.Chat_Id ? newMessage : m);
      }
      return [...prev, newMessage];
    });
    updateRoomLastMessage(newMessage);
  }

  socket.on("receive_message",receive_message)
  return () => {
    socket.off("receive_message")
  };
}, [socket]);



useEffect(() => {
  if (!activeRoom) return;

const fetchHistory= async() => {
    try {
    
      const response = await axios.get(`http://localhost:3000/api/readmessages/${activeRoom.Room_Id}`
        ,{headers:{authorization:localStorage.getItem("token")}}
      )
      console.log("History response:", response.data); 

      setMessages(response.data.result)
    } catch (err) {
      console.error("Load history failed:", err);
    }
  }

  fetchHistory();
}, [activeRoom]);

useEffect(() => {
  const fetchRooms = async () => {
    try {
      const usersId = JSON.parse(localStorage.getItem("user")).payload.id;
      const response = await axios.get(`http://localhost:3000/api/listmyrooms/${usersId}`, {
        headers: { authorization: localStorage.getItem("token") }
      });

      const rooms = response.data.result;
      const promises = rooms.map((room)=> {
        const otherUserId = getOtherUserId(room, usersId)
        return axios.get(`http://localhost:3000/api/readprofile/${otherUserId}`,
        {headers:{authorization:localStorage.getItem("token")}}
      )
      })

      const profileResponses = await Promise.all(promises)

      const roomsWithNames = rooms.map((room,index) => {
        const profile = profileResponses[index].data.result
        return {...room, otherUserName: `${profile.First_Name} ${profile.Last_Name}`
}
      })
      setRoomsList(roomsWithNames) 
      
    } catch (err) {
      console.error("Load rooms failed:", err.response.data.message);
    }
  };
  fetchRooms();
}, []); 

const sendMessage = async (text, file) => {
  if (!activeRoom || !socket) return;

  try {
        const otherUserId = getOtherUserId(activeRoom, currentUserId); 

    const formData = new FormData();
  
    formData.append("Service_Id",activeRoom.Service_Id)
    formData.append("Room_Id",activeRoom.Room_Id)
    formData.append("Sender_Id", currentUserId) 
    formData.append("Receiver_Id", otherUserId)
    formData.append("Message",text)
    
    if(file){
      formData.append("file", file);
    }
    const response = await axios.post(
      "http://localhost:3000/api/newmessage",
      formData,
      {
        headers: { authorization: localStorage.getItem("token") }
      }
    );
    console.log(response.data);
    socket.emit("send_message", response.data.result);
    updateRoomLastMessage(response.data.result);
  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

const sendOffer = async (offerData) => {
  if (!activeRoom || !socket) return;

  try {
    const otherUserId = getOtherUserId(activeRoom, currentUserId);
    const response = await axios.post(
      "http://localhost:3000/api/offer-price",
      {

        Service_Id:activeRoom.Service_Id,
        Room_Id:activeRoom.Room_Id,
        Sender_Id:currentUserId,
        Receiver_Id:otherUserId,
        Price:offerData.price,
        Work_Date:offerData.startDate,
        Work_Date_End:offerData.endDate,
      },
      {
        headers: { authorization: localStorage.getItem("token") }
      }
    );
    console.log(response.data);
    socket.emit("send_message", response.data.result);
   
    updateRoomLastMessage(response.data.result);
  } catch (error) {
    console.log(error.response?.data?.message);
     console.log("Full error:", error);
  console.log("Response:", error.response);
  console.log("Response data:", error.response?.data);
  }
};


const acceptOffer = async (offerMessage) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/createorder",
      {
        Users_Id: offerMessage.Receiver_Id,
        Tech_Id: offerMessage.Sender_Id,
        Service_Id: activeRoom.Service_Id,
        Final_Price: offerMessage.Price,
        Work_Date: offerMessage.Work_Date,
        Work_Date_End: offerMessage.Work_Date_End,
        Chat_Id: offerMessage.Chat_Id
      },
      { headers: { authorization: localStorage.getItem("token") } }
    );
    console.log(response.data);
    

    const updateOffer ={
      ...offerMessage,
      Type:"PRICE_ACCEPT"
    }
    socket.emit("send_message",updateOffer);
    updateRoomLastMessage(updateOffer);
    
  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

const rejectOffer = async (offerMessage) => {
  try {
    await axios.patch(
      "http://localhost:3000/api/rejectPrice",
      { Chat_Id: offerMessage.Chat_Id },
      { headers: { authorization: localStorage.getItem("token") } }
    );
    const updateRejec ={
      ...offerMessage,
      Type:"PRICE_REJECT"
    }
     socket.emit("send_message",updateRejec);
    updateRoomLastMessage(updateRejec);
    
  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

//------------------------
//Function receive_message
//------------------------



  return (
    <div className="chat-container">
  
  <RoomList rooms={roomsList} 
    onSelectRoom={setActiveRoom} 
    disabled={showOfferModal}
    />
  
  <ChatRoom 
  room={activeRoom} 
  messages={messages} 
  onSendMessage={sendMessage} 
  currentUserId={currentUserId} 
  isTechnician={isTechnician}
  onSendOffer={sendOffer}
  onAcceptOffer={acceptOffer}
  onRejectOffer={rejectOffer}
  showOfferModal={showOfferModal}        
        setShowOfferModal={setShowOfferModal}  
  />           
  
  </div>
  );
}
