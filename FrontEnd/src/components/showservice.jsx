import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import "./ShowService.css";
import socket from "./chart/useSocket"


export default function ShowService({ service }) {
  const navigate = useNavigate();
    const [receiverData, setReceiverData] = useState(null);
    const userId = Number(localStorage.getItem("id"))

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

    //----------------------------------------
const handleChat = async () => {
   console.log("receiverId ตอนเริ่ม:", receiverId) 
  const senderId = Number(localStorage.getItem("id"))
  const ids = [senderId, receiverId].sort((a, b) => a - b)
  const roomId = `room_${ids[0]}_${ids[1]}_${service.Service_Id}`

  try {
    const res = await axios.get(`http://localhost:3000/api/listmyrooms/${senderId}`, {
      headers: { authorization: localStorage.getItem("token") }
    })
    const existingRoom = res.data.result.find(r => r.Room_Id === roomId)

    if (!existingRoom) {
      // ห้องใหม่ → ส่งข้อความแรกผ่าน HTTP
      await axios.post("http://localhost:3000/api/newmessage", {
        Room_Id: roomId,
        Sender_Id: senderId,
        Receiver_Id: receiverId,
        Service_Id: service.Service_Id,
        Message: `สวัสดีครับ สนใจบริการ "${service.Title}"`,
        Type: "MESSAGE"
      }, { headers: { authorization: localStorage.getItem("token") } })
    }

    // navigate ได้เลย — มั่นใจว่าห้องมีใน DB แล้ว
    console.log("roomId:", roomId)
    console.log("receiverId:", receiverId)  // ← เพิ่มก่อน navigate
    navigate("/chatpage", { state: { 
      roomId, receiverId, serviceUserId: service.Users_Id } })
  } catch (err) {
    console.error(err)
    alert("ไม่สามารถเปิดแชทได้")
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
      <p>{service.Users_Id}</p>
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

{service.Users_Id !== userId && (
  <button className="button3" onClick={handleChat}>ติดต่อผู้รับงาน</button>
            )}    
</div>
    </div>
  );
}