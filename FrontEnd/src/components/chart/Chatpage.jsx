import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import socket from "./useSocket"
import "./Chatpage.css"
import usePartnerProfile from "./usePartnerProfile"
import { useLocation } from "react-router-dom" 
import PriceOfferModal from "./PriceOfferModal"
  

// -----------------------------------------------------
  // หา ID ของอีกฝ่ายในห้อง
  // -----------------------------------------------------
  const getOtherUserId = (room,userId) => {
    if (!room) return null 
    return room.Sender_Id === userId 
    ? room.Receiver_Id 
    : room.Sender_Id
    
}

// -----------------------------------------------------
// profile ของแต่ละห้อง
//-----------------------------------------------------
const RoomSidebarItem = ({ room, isActive, userId, onClick }) => {

  const profile = usePartnerProfile(getOtherUserId(room,userId))
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        cursor: "pointer",
        background: isActive ? "#dbeafe" : "transparent",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
    >
      {/* รูป avatar */}
      <img
        src={profile?.Avatar
          ? `http://localhost:3000/uploads/${profile.Avatar}`
          : "/default-avatar.png"}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />

      {/* ชื่อ + ข้อความล่าสุด */}
      <div>
        <div style={{ fontWeight: "500", fontSize: "14px" }}>
          {profile
            ? `${profile.First_Name} ${profile.Last_Name}`
            : `ผู้ใช้ #${getOtherUserId(room)}`}
        </div>
        <div className="sidebarmessages">
            
          <p className="messagesside">{room.Image ?  "ได้ส่งรูปภาพ"  :room.Message || "(ไม่มีข้อความ)"}</p>
        </div>
      </div>
    </div>
  )
  }



  // -----------------------------------------------------
  //ChatPage Main Function
  // -----------------------------------------------------


function ChatPage() {
  const navigate = useNavigate()
  const userId = Number(localStorage.getItem("id"))
  const token = localStorage.getItem("token")
  const location = useLocation()           // ← เพิ่ม
  // -----------------------------------------------------
  // STATE
  // -----------------------------------------------------
  const [rooms, setRooms] = useState([])        // รายการห้องแชท
  const [activeRoom, setActiveRoom] = useState(null)  // ห้องที่เลือกอยู่
  const [messages, setMessages] = useState([])  // ข้อความในห้อง
  const [input, setInput] = useState("")         // ข้อความที่พิมพ์
  const [image, setImage] = useState(null)       // ไฟล์รูปที่เลือก
  const [preview, setPreview] = useState(null)   // URL preview รูปก่อนส่ง
  const incomingState = location.state || null
  const [showPriceModal, setShowPriceModal] = useState(false)

  // -----------------------------------------------------
  // เชื่อม Socket + เช็ค Login
  // -----------------------------------------------------
  useEffect(() => {
    if (!userId || !token) { navigate("/lar"); 
      alert("กรุณาเข้าสู่ระบบก่อน")
      return 

    }

    socket.connect()
    return () => socket.disconnect()
  }, [])

  // -----------------------------------------------------
  // ดึงรายการห้องแชททั้งหมดของ User
  // -----------------------------------------------------
useEffect(() => {
  async function fetchRooms() {
    try {
      const res = await axios.get(`http://localhost:3000/api/listmyrooms/${userId}`, {
        headers: { authorization: token }
      })

      const roomList = res.data.result   // ← เก็บไว้ในตัวแปรก่อน
      setRooms(roomList)

      // ตอนนี้ใช้ roomList ได้แล้ว
      if (incomingState?.roomId) {
        const targetRoom = roomList.find(r => r.Room_Id === incomingState.roomId)
        if (targetRoom) {
          setActiveRoom(targetRoom)
          console.log(targetRoom)
        }
      }

    } catch (err) { console.log(err) }
  }
  fetchRooms()
}, [])

  // -----------------------------------------------------
  // เมื่อเลือกห้อง → เข้า Socket Room + ดึงข้อความในห้อง
  // -----------------------------------------------------
  useEffect(() => {
    if (!activeRoom) return
    socket.emit("join_room", activeRoom.Room_Id)
    async function fetchMessages() {
      try {
        const res = await axios.get(`http://localhost:3000/api/readmessages/${activeRoom.Room_Id}`, {
          headers: { authorization: token }
        })
        setMessages(res.data.result)
      } catch (err) { console.log(err) }
    }
    fetchMessages()
  }, [activeRoom])

  // -----------------------------------------------------
  // รับข้อความ Real-time จาก Socket
  // -----------------------------------------------------
  useEffect(() => {
    socket.on("receive_message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg])  // เพิ่มข้อความใหม่เข้า state
    })
    return () => socket.off("receive_message")  // cleanup เมื่อ component ถูกทำลาย
  }, [])
  // -----------------------------------------------------
  //ช่างเสนอราคา
  // -----------------------------------------------------
    const sendPrice = async (price , note)=>{
    try{
        const response = await 
        axios.post("http://localhost:3000/api/offerprice",{
          Service_Id: activeRoom.Service_Id,
      Room_Id: activeRoom.Room_Id,
      Sender_Id: userId,
      Receiver_Id: getOtherUserId(activeRoom, userId),
      Price: price,
      Message: note},
      {
        headers:{authorization :token}
      })
    setMessages((prev) => [...prev, response.data.result])
    setShowPriceModal(false)
    }catch(err){
      console.log(err)
    }

    }




  // -----------------------------------------------------
  // ส่งข้อความผ่าน Socket
  // -----------------------------------------------------
  const sendMessage = () => {
    if (!input.trim()) return  // ถ้าไม่มีข้อความก็ไม่ส่ง
    socket.emit("send_message", {
      Room_Id: activeRoom.Room_Id,
      Sender_Id: userId,
      Receiver_Id: getOtherUserId(activeRoom, userId),
      Message: input,
      Service_Id: activeRoom.Service_Id,
      Type: "MESSAGE"
    })
    setInput("")  // เคลียร์ช่องพิมพ์
  }

  // -----------------------------------------------------
  // ส่งรูปภาพผ่าน HTTP (multipart/form-data)
  // -----------------------------------------------------
  const sendImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)                               // ไฟล์รูป
    formData.append("Room_Id", activeRoom.Room_Id)
    formData.append("Sender_Id", userId)
    formData.append("Receiver_Id", getOtherUserId(activeRoom,userId))
    formData.append("Service_Id", activeRoom.Service_Id)
    formData.append("Type", "IMAGE")
    try {
      const res = await axios.post("http://localhost:3000/api/newmessage", formData, {
        headers: { authorization: token }
      })
      setMessages((prev) => [...prev, res.data.result])  // เพิ่มรูปเข้า state
    } catch (err) { console.log(err) }
  }
  


  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="Uimain">

      {/* -------- Sidebar -------- */}
      <div className="sidebar">
        <h3 className="sidebar-title">ข้อความ</h3>
        {rooms.map((room) => (
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
          {!activeRoom
            ? <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>เลือกห้องแชททางซ้าย</div>
            : messages.map((msg) => {
                const isMine = msg.Sender_Id === userId
                return (
                  <div key={msg.Chat_Id} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMine ? "flex-end" : "flex-start",
                    marginBottom: "10px"
                  }}>

                    {/* Bubble */}
                    <div style={{
                      maxWidth: "60%",
                      padding: msg.Type === "IMAGE" ? "4px" : msg.Type === "PRICE_OFFER" ? "0px" : "10px 14px",
                      borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.Type === "PRICE_OFFER" ? "transparent" : isMine ? "#3b82f6" : "#f3f4f6",
                      color: isMine ? "#fff" : "#111",
                      fontSize: "16px",
                      fontFamily: "sans-serif",
                      lineHeight: "1.5",
                    }}>

                      {msg.Type === "PRICE_OFFER" ? (
                        <div style={{
                          background: "#fff7ed",
                          border: "1px solid #e37f22",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          minWidth: "180px"
                        }}>
                          <p style={{ margin: 0, fontSize: "12px", color: "#e37f22", fontWeight: 600 }}>💰 เสนอราคา</p>
                          <p style={{ margin: "6px 0 0", fontSize: "20px", fontWeight: 700, color: "#111" }}>
                            ฿{msg.Price?.toLocaleString()}
                          </p>
                          {msg.Message && msg.Message !== "เสนอราคา" && (
                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>{msg.Message}</p>
                          )}
                        </div>
                      ) : msg.Type === "IMAGE" ? (
                        <img src={`http://localhost:3000/uploads/${msg.Image}`} className="ImageL" />
                      ) : (
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
              })
          }
        </div>

        {/* -------- Input Bar -------- */}
        {activeRoom && (
          <div className="divInput">
            {preview && (
              <div className="previewO">
                <img src={preview} className="previewL" />
                <button onClick={() => { setPreview(null); setImage(null) }} className="Close">✕</button>
              </div>
            )}

            <div className="inputall">
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

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="พิมพ์ข้อความ..."
                className="inputMessage"
              />

              <button
                onClick={() => {
                  if (image) { sendImage(image); setImage(null); setPreview(null) }
                  else { sendMessage() }
                }}
                className="buttonMessage"
              >ส่ง</button>

              {/* ปุ่มเสนอราคา — เฉพาะช่าง */}
              {activeRoom?.Sender_Id === userId && (
                <button onClick={() => setShowPriceModal(true)} className="imageinsert">
                  <p className="f3">เสนอราคา</p>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal — อยู่นอก map และนอก mainChat */}
      {showPriceModal && (
        <PriceOfferModal
          onClose={() => setShowPriceModal(false)}
          
          onSend={sendPrice}
        />
      )}

    </div>
  )
}

export default ChatPage