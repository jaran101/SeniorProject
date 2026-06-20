import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import "./ShowService.css";
import socket from "./chart/useSocket"


export default function ShowService({ service }) {
  const navigate = useNavigate();
    const [receiverData, setReceiverData] = useState(null);
    
    const receiverId = service.Users_Id;

      useEffect(() => {
      const fethuser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/readprofile/${receiverId}`, {
            headers: { authorization: localStorage.getItem("token") },
          }
        );
          setReceiverData(response.data)
          console.log("โหลดข้อมูลสำเร็จ:", response.data);
        } catch (error) {
          console.error("โหลดข้อมูลไม่สำเร็จ:", error);
          console.log("error:", error.response?.data);
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่: " + error.response?.data?.msg);
        }
      };
      fethuser();
    },[receiverId]);

    console.log(service.Price)
    //----------------------------------------
 const handleChat = async () => {
  const userData = localStorage.getItem("user")
  const senderId = JSON.parse(userData).payload.id
  const ids = [senderId, receiverId].sort((a, b) => a - b)
  const roomId = `room_${ids[0]}_${ids[1]}_${service.Service_Id}`

  try {
    // ⭐ เช็คก่อนว่าห้องมีอยู่แล้วไหม
    const res = await axios.get( "http://localhost:3000/api/listmyrooms/" + 
      senderId,
      { headers: { authorization: 
        localStorage.getItem("token") } }
    )

    const existingRoom = 
    res.data.result.find((r) => r.Room_Id === roomId)


   await socket.connect()

    

  //  socket.once ("connect", () => {
    socket.emit("join_room", roomId)
    socket.emit("send_message", {
      Room_Id: roomId,
      Sender_Id: senderId,
      Receiver_Id: receiverId,
      Service_Id: service.Service_Id,
      Message: `สวัสดีครับ สนใจบริการ "${service.Title}" ราคา ${service.Price?.toLocaleString()} บาท ${service.Service_Id} `,
      Type: "MESSAGE"
    })
  // })
    // ห้องมีอยู่แล้ว หรือสร้างเสร็จแล้ว → navigate ไปเลย
    navigate("/chatpage", {
      
      state: { roomId,
        serviceId: service.Service_Id,
        senderId, 
        receiverId,
      offerPrice: service.Price,           // ← เพิ่ม
    offerTitle: service.Title,           // ← เพิ่ม
    isNewOffer: !existingRoom
  },
    })

  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err)
    alert("ไม่สามารถเปิดแชทได้ กรุณาลองใหม่")

  }
}

//--------------------------
  return (
    <div>
      <div className="container">
      <img className="imgservice"
        src={`http://localhost:3000/uploads/${service.Image}`}
        alt={service.Title}
      />
      <p>{service.Title}</p>
      <p><strong>รายละเอียด:</strong> {service.Description}</p>
      <p><strong>ราคา:</strong> {service.Price?.toLocaleString()} บาท</p>
      <p><strong>ประเภท:</strong> {service.Category}</p>
      <div className="user">
                <img className="imguser" src={`http://localhost:3000/uploads/${receiverData?.Avatar ?? service.Avatar}`} alt="avatar" width={120} />
        <p>
        <strong>
          ผู้รับงาน: {receiverData?.First_Name ?? service.First_Name}{" "}
          {receiverData?.Last_Name ?? service.Last_Name}
        </strong>
      </p></div>

      <button className="button3" onClick={handleChat}>ติดต่อผู้รับงาน</button>
    </div>
    </div>
  );
}