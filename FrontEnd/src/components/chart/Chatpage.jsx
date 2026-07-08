import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import socket from "./useSocket"
import usePartnerProfile from "./usePartnerProfile"
import PriceOfferModal from "./PriceOfferModal"
import "./Chatpage.css"

// -----------------------------------------------------
// Helper: หา ID ของผู้ใช้อีกฝั่งในห้องแชท
// -----------------------------------------------------
const getOtherUserId = (room, userId) => {
  if (!room) return null
  return room.Sender_Id === userId ? room.Receiver_Id : room.Sender_Id
}

// -----------------------------------------------------
// Child component: แสดงรายการห้องแชทใน sidebar
// พร้อมชื่อคู่สนทนาและข้อความล่าสุดของห้องนั้น
// -----------------------------------------------------
const RoomSidebarItem = ({ room, isActive, userId, onClick }) => {
  const profile = usePartnerProfile(getOtherUserId(room, userId))

  // ข้อความล่าสุดของห้อง
  const lastMessage = room.Image
    ? "ได้ส่งรูปภาพ"
    : room.Type === "PRICE_OFFER"
    ? "เสนอราคา"
    : room.Message || "(ไม่มีข้อความ)"

  return (
    <div
      onClick={onClick}
       className={`sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
    >
      <img
        src={profile?.Avatar
          ? `http://localhost:3000/uploads/${profile.Avatar}`
          : "/default-avatar.png"}
        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
      />
      <div>
        <div style={{ fontWeight: "500", fontSize: "14px" }}>
          {profile
            ? `${profile.First_Name} ${profile.Last_Name}`
            : `ผู้ใช้ #${getOtherUserId(room, userId)}`}
        </div>
        <p className="messagesside">{lastMessage}</p>
      </div>
    </div>
  )
}

// -----------------------------------------------------
// Helper: แปลงวันที่ให้เป็นข้อความภาษาไทย
// -----------------------------------------------------
const formatDate = (date) => {
  if (!date) return "ไม่ระบุวัน"
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric"
  })
}

// -----------------------------------------------------
// ChatPage — Main Component
// -----------------------------------------------------
export default function ChatPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const userId = Number(localStorage.getItem("id"))
  const token = localStorage.getItem("token")
  const incomingState = location.state || null

  // -----------------------------------------------------
  // State หลักของหน้าแชท
  // เก็บห้องแชท ข้อความที่แสดง และข้อมูลที่เกี่ยวข้องกับห้องที่เลือก
  // -----------------------------------------------------
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [serviceUserId, setServiceUserId] = useState(incomingState?.serviceUserId || null)
  const [serviceDetail, setServiceDetail] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [viewImage, setViewImage] = useState(null)
  const [tech,setTech]=useState(0)
  // -----------------------------------------------------
  // Effect: ตรวจสถานะ login และเชื่อมต่อ socket เมื่อเปิดหน้า
  // -----------------------------------------------------
  useEffect(() => {
    if (!userId || !token) {
      alert("กรุณาเข้าสู่ระบบก่อน")
      navigate("/lar")
      return
    }
    socket.connect()
    return () => socket.disconnect()
  }, [])

  // -----------------------------------------------------
  // Effect: ดึงรายการห้องแชททั้งหมดมาแสดงใน sidebar
  // -----------------------------------------------------
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await axios.get(`http://localhost:3000/api/listmyrooms/${userId}`, {
          headers: { authorization: token }
        })
        const roomList = res.data.result
        setRooms(roomList)


        if (incomingState?.roomId) {
          const targetRoom = roomList.find(r => r.Room_Id === incomingState.roomId)
          if (targetRoom) setActiveRoom(targetRoom)
        }
      } catch (err) { console.log(err) }
    }
    fetchRooms()
  }, [])

  // -----------------------------------------------------
  // Effect: เมื่อเลือกห้องใหม่ จะเข้าร่วมห้องและโหลดข้อความกับข้อมูลบริการที่เกี่ยวข้อง
  // -----------------------------------------------------
  useEffect(() => {
    if (!activeRoom) return
    socket.emit("join_room", activeRoom.Room_Id)
    fetchMessages()
    fetchService()
  }, [activeRoom])

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/readmessages/${activeRoom.Room_Id}`, {
        headers: { authorization: token }
      })
      const msgList = res.data.result
      setMessages(msgList)

      // อัพเดตข้อความล่าสุดใน Sidebar
      const lastMsg = msgList[msgList.length - 1]
      if (lastMsg) {
        setRooms(prev => prev.map(r =>
          r.Room_Id === activeRoom.Room_Id
            ? { ...r, Message: lastMsg.Message, Image: lastMsg.Image, Type: lastMsg.Type }
            : r
        ))
      }
    } catch (err) { console.log(err) }
  }

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/readservice/${activeRoom.Service_Id}`, {
        headers: { authorization: token }
      })
      const s = res.data.result
      setServiceDetail(s)
      setServiceUserId(s.Users_Id)
    } catch (err) { console.log(err) }
  }

  // -----------------------------------------------------
  // Effect: รับข้อความแบบ real-time จาก socket และอัปเดตทั้งหน้าจอและ sidebar
  // -----------------------------------------------------
  useEffect(() => {
    socket.off("receive_message")
    socket.on("receive_message", (newMsg) => {
    console.log("รับข้อความ:", newMsg.Chat_Id, newMsg.Message)  
      setMessages(prev => [...prev, newMsg])
      setRooms(prev => {
        const exists = prev.find(r => r.Room_Id === newMsg.Room_Id)
        if (exists) {
          return prev.map(r =>
            r.Room_Id === newMsg.Room_Id
              ? { ...r, Message: newMsg.Message, Image: newMsg.Image, Type: newMsg.Type }
              : r
          )
        }
        return prev
      })
    })
    return () => socket.off("receive_message")
  }, [])

  // -----------------------------------------------------
  // Action: ส่งข้อความปกติลงห้องแชท
  // -----------------------------------------------------
  const sendMessage = async () => {
  if (!input.trim()) return

  const data = {
    Room_Id: activeRoom.Room_Id,
    Sender_Id: userId,
    Receiver_Id: getOtherUserId(activeRoom, userId),
    Message: input,
    Service_Id: activeRoom.Service_Id,
    Type: "MESSAGE"
  }

  const messageData =new FormData()
  messageData.append("Room_Id", activeRoom.Room_Id)
  messageData.append("Sender_Id", userId)
  messageData.append("Receiver_Id", getOtherUserId(activeRoom, userId))
  messageData.append("Message", input)
  messageData.append("Service_Id", activeRoom.Service_Id)
  messageData.append("Type", "MESSAGE")
  console.log("ส่งข้อความ:", messageData.get("Message"))  // ← ดูตรงนี้



    try{
      const res = await axios.post("http://localhost:3000/api/newmessage", messageData, {
        headers: { authorization: token }
      })
      console.log("ส่งข้อความสำเร็จ:", res.data.result)
        socket.emit("send_message", res.data.result)
          console.log("ส่งข้อมูล:", res.data.result)  // ← ดูตรงนี้

    }catch(err){
      console.log(err.res.message) 
    }


  setInput("")
}

  // -----------------------------------------------------
  // Action: ส่งรูปภาพเข้าในห้องแชท
  // -----------------------------------------------------
  const sendImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("Room_Id", activeRoom.Room_Id)
    formData.append("Sender_Id", userId)
    formData.append("Receiver_Id", getOtherUserId(activeRoom, userId))
    formData.append("Service_Id", activeRoom.Service_Id)
    formData.append("Type", "IMAGE")

    try {
      const res = await axios.post("http://localhost:3000/api/newmessage", formData, {
        headers: { authorization: token }
      })
      socket.emit("send_message", res.data.result)
    } catch (err) { console.log(err) }
  }

  // -----------------------------------------------------
  // Action: ช่างส่งข้อเสนอราคาให้ลูกค้า
  // -----------------------------------------------------
  const sendPrice = async (price, note, date, dateEnd) => {
    try {
      const res = await axios.post("http://localhost:3000/api/offer-price", {
        Service_Id: activeRoom.Service_Id,
        Room_Id: activeRoom.Room_Id,
        Sender_Id: userId,
        Receiver_Id: getOtherUserId(activeRoom, userId),
        Price: price,
        Work_Date: date,
        Work_Date_End: dateEnd,
        Message: note
      }, { headers: { authorization: token } })
      socket.emit("send_message", res.data.result)
      setShowPriceModal(false)
    } catch (err) { 
      console.log(err) 
      console.log(err.response.data)
    }
  }
  // -----------------------------------------------------
  // Action: ลูกค้ายืนยันคำสั่งซื้อจากข้อเสนอราคา
  // -----------------------------------------------------
  const createOrder = async (msg) => {
    
 const techId = userId !== msg.Receiver_Id ? msg.Receiver_Id : msg.Sender_Id

  //  ตรวจสอบค่าก่อนส่ง
  console.log("msg:", msg)
  console.log("activeRoom:", activeRoom)
  console.log("userId:", userId)
  console.log("techId:", techId)
  console.log("Service_Id:", activeRoom?.Service_Id)
  console.log("Final_Price:", msg.Price)
  console.log("Work_Date:", msg.Work_Date)
    try {
      await axios.post("http://localhost:3000/api/createorder", {
       
        Chat_Id: msg.Chat_Id,
        Users_Id: userId,
        Tech_Id: techId,
        Service_Id: Number(activeRoom?.Service_Id),
        Final_Price: msg.Price,
        Work_Date: msg.Work_Date,
        Work_Date_End: msg.Work_Date_End,
      }, { headers: { authorization: token } })

      setMessages((prev) =>
      prev.map((m) =>
        m.Message_Id === msg.Message_Id
          ? { ...m, Type: "PRICE_ACCEPT" }
          : m
      )
    )

      alert("ยืนยันงานสำเร็จ")
    } catch (err) {
      console.log(err.response?.data?.message)
    }
      console.log(tech)

  }
// -----------------------------------------------------
// Action: ลูกค้าปฏิเสธข้อเสนอราคา
// -----------------------------------------------------
const rejectOffer = async (msg) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/rejectPrice`,
      { Chat_Id:msg.Chat_Id },
      { headers: { authorization: token } }
    )
    // อัพเดต status ใน messages ทันทีโดยไม่ต้อง reload
    setMessages(prev =>
      prev.map(m => m.Chat_Id === msg.Chat_Id ? { ...m, Type: "PRICE_REJECT" } : m)
    )
    alert("ปฎิเสธใบเสนอราคาเสร็จสิ้น")
  } catch (err) {
    console.log(err.response?.data?.message)
  }
}
// -----------------------------------------------------
// Helper: แปลงประเภทข้อความให้เป็นข้อความแสดงสถานะที่อ่านง่าย
// -----------------------------------------------------
 const formatType = (Type) => {
    if (Type === "PRICE_OFFER") return "กำลังพิจารณา";
    if (Type === "PRICE_ACCEPT") return "ลูกค้ายืนยัน";
    if (Type === "PRICE_REJECT") return "ลูกค้าปฎิเสธ";
    return "-";
  };






// -----------------------------------------------------
// UI: แสดง sidebar, กล่องข้อความและแถบป้อนข้อความ
// -----------------------------------------------------
  return (
    <div className="Uimain">

      {/* -------- Sidebar -------- */}
      <div className="sidebar">
        <h3 className="sidebar-title">ข้อความ</h3>
        {rooms.map(room => (
          <RoomSidebarItem
            key={room.Room_Id}
            room={room}
            isActive={activeRoom?.Room_Id === room.Room_Id}
            userId={userId}
            onClick={() => setActiveRoom(room)}
          />
        ))}
      </div>

      {/* -------- Main Chat -------- */}
      <div className="mainChat">
        <div className="messages">

          {/* แสดงสถานะเมื่อยังไม่ได้เลือกห้องแชท */}
          {!activeRoom && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
              เลือกห้องแชททางซ้าย
            </div>
          )}

          {/* แสดงข้อความทั้งหมดในห้องที่เลือกอยู่ */}
          {activeRoom && messages.map((msg,index) => {
            const isMine = msg.Sender_Id === userId
            return (
              <div key={msg.Chat_Id ?? index } style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}>
                {/* Bubble */}
                <div className={`
                                bubble
                                ${isMine ? "bubble--mine" : "bubble--other"}
                                ${msg.Type === "PRICE_OFFER" ? "bubble--offer" : ""}
                                ${msg.Type === "IMAGE" ? "bubble--image" : ""}
                              `}>
                  {/* แสดงข้อความประเภทเสนอราคา/ยืนยัน/ปฏิเสธ */}
                  {(msg.Type === "PRICE_OFFER" ||msg.Type === "PRICE_ACCEPT" ||msg.Type === "PRICE_REJECT")&& (
                    <div className="priceoffer">
                      <p className="present"> เสนอราคางาน {msg.Title}</p>
                      <p className="presentprice">฿{msg.Price?.toLocaleString()}</p>
                      <p style={{"color":"black"}}>สถานะ :{formatType(msg.Type)}</p>
                        <p style={{ fontSize: "13px", color: "#555" }}>
                          รายละเอียด: {msg.Message}
                          
                        </p>
                  


                      <div style={{ display: "flex", gap: "8px" }}>
                        <p className="msg-time">เริ่ม: {formatDate(msg.Work_Date)}</p>
                        <p className="msg-time">สิ้นสุด: {formatDate(msg.Work_Date_End)}</p>
                      </div>

                      {/* ปุ่มยืนยัน — เฉพาะลูกค้า */}
                      {userId !== serviceUserId && msg.Type !== "PRICE_REJECT" && msg.Type !== "PRICE_ACCEPT"&& (
                        <div className="btAC">
                          <button className="buttonAccep" onClick={() => createOrder(msg)}>
                            ยืนยัน
                          </button>
                          <button className="buttonCancel" onClick={()=>rejectOffer(msg)}>
                            ยกเลิก
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* แสดงข้อความประเภทรูปภาพ */}
                  {msg.Type === "IMAGE" && (
                    <img
                      src={`http://localhost:3000/uploads/${msg.Image}`}
                      className="ImageL"
                      onClick={() => setViewImage(`http://localhost:3000/uploads/${msg.Image}`)}
                    />
                  )}

                  {/* แสดงข้อความประเภทข้อความทั่วไป */}
                  {msg.Type === "MESSAGE" && (
                    <div>{msg.Message}</div>
                  )}

                </div>

                {/* เวลา */}
                <span className="msg-time">
                  {new Date(msg.Created_At).toLocaleTimeString("th-TH", {
                    hour: "2-digit", minute: "2-digit", hour12: false
                  })}
                </span>

              </div>
            )
          })}
        </div>

        {/* แถบป้อนข้อความและปุ่มต่าง ๆ สำหรับส่งข้อความ */}
        {activeRoom && (
          <div className="divInput">

            {/* Preview รูป */}
            {preview && (
              <div className="previewO">
                <img src={preview} className="previewL" />
                <button onClick={() => { setPreview(null); setImage(null) }} className="Close">✕</button>
              </div>
            )}

            <div className="inputall">

              {/* ปุ่มแนบรูป */}
              <label className="imageinsert">
                <p className="f3">รูปภาพ</p>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    setImage(file)
                    setPreview(URL.createObjectURL(file))
                    e.target.value = ""
                  }}
                />
              </label>

              {/* ช่องพิมพ์ */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="พิมพ์ข้อความ..."
                className="inputMessage"
              />

              {/* ปุ่มส่ง */}
              <button
                className="buttonMessage"
                onClick={() => {
                  if (image) { sendImage(image); setImage(null); setPreview(null) }
                  else { sendMessage() }
                }}
              >
                ส่ง
              </button>

              {/* ปุ่มเสนอราคา — เฉพาะช่าง */}
              {serviceUserId === userId && (
                <button onClick={() => setShowPriceModal(true)} className="imageinsert">
                  <p className="f3">เสนอราคา</p>
                </button>
              )}

            </div>
          </div>
        )}
      </div>

      {/* -------- PriceOfferModal -------- */}
      {showPriceModal && (
        <PriceOfferModal
          onClose={() => setShowPriceModal(false)}
          service={serviceDetail}
          onSend={sendPrice}
        />
      )}

      {/* -------- Lightbox -------- */}
      {viewImage && (
        <div className="lightbox-overlay" onClick={() => setViewImage(null)}>
          <button className="lightbox-close" onClick={() => setViewImage(null)}>✕</button>
          <img
            src={viewImage}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  )
}

export default ChatPage