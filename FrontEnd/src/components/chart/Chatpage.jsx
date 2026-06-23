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
            
          <p className="messagesside">{room.Image ?  "ได้ส่งรูปภาพ"  :room.Message || "(ไม่มีข้อความ)"}
            
          </p>
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
  const [showPriceModal, setShowPriceModal] = useState(false)
  const incomingState = location.state || null
const [serviceUserId, setServiceUserId] = useState(incomingState?.serviceUserId || null)
const [serviceDetail, setServiceDetail] = useState(null)
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
  // ดึงรายการห้องแชททั้งหมดของ User (SildeBar)
  // -----------------------------------------------------

useEffect(() => {
  async function fetchRooms() {
    try {
      const res = await axios.get(`http://localhost:3000/api/listmyrooms/${userId}`, {
        headers: { authorization: token }
      })
      const roomList = res.data.result
      setRooms(roomList)

      // join ทุกห้องเพื่อรับข้อความ real-time
      roomList.forEach(room => {
        socket.emit("join_room", room.Room_Id)
      })

      if (incomingState?.roomId) {
        const targetRoom = roomList.find(r => r.Room_Id === incomingState.roomId)
        if (targetRoom) setActiveRoom(targetRoom)
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
    console.log("fetchMessages called:", activeRoom.Room_Id)  // ← ดูว่าเรียกกี่ครั้ง

  socket.emit("join_room", activeRoom.Room_Id)
  async function fetchMessages() {
    try {
      const res = await axios.get(`http://localhost:3000/api/readmessages/${activeRoom.Room_Id}`, {
        headers: { authorization: token }
      })
          console.log("messages from DB:", res.data.result)  // ← ดูว่ามีซ้ำใน DB ไหม
        console.log("DB count:", res.data.result.length)

      setMessages(res.data.result)

      const lastMsg = res.data.result[res.data.result.length - 1]  // ✅
      if (lastMsg) {
        setRooms((prev) => {
          const exists = prev.find(r => r.Room_Id === activeRoom.Room_Id)  // ✅
          if (exists) {  // ✅
            return prev.map(r => r.Room_Id === activeRoom.Room_Id
              ? { ...r, Message: lastMsg.Message, Image: lastMsg.Image }
              : r
            )
          } else {
            return [{ ...activeRoom, Message: lastMsg.Message, Image: lastMsg.Image }, ...prev]
          }
        })
      }
    } catch (err) { console.log(err) }
  }
  fetchMessages()
}, [activeRoom])
  // -----------------------------------------------------
  // รับข้อความ Real-time จาก Socket
  // -----------------------------------------------------
useEffect(() => {
  socket.on("receive_message", (newMsg) => {
        console.log("receive_message fired:", newMsg.Chat_Id)  // ← ดูว่า fire กี่ครั้ง
          console.log("receive fired, current messages length:", )

    setMessages((prev) => [...prev, newMsg])
        console.log("prev length:", prev.length, "newMsg:", newMsg.Chat_Id)

    // อัพเดต sidebar
    setRooms((prev) => {
      const roomExists = prev.find(r => r.Room_Id === newMsg.Room_Id)

      if (roomExists) {
        // ห้องมีอยู่แล้ว → แค่อัพเดตข้อความล่าสุด
        return prev.map((room) =>
          room.Room_Id === newMsg.Room_Id
            ? { ...room, Message: newMsg.Message, Image: newMsg.Image }
            : room
        )
      } else {
        // ห้องใหม่ → เพิ่มเข้า sidebar เลย
        return [newMsg, ...prev]
      }
    })
  })
  return () => socket.off("receive_message")
}, [])
  // -----------------------------------------------------
  //ช่างเสนอราคา
  // -----------------------------------------------------
    const sendPrice = async (price , note)=>{
    try{
        const response = await 
        axios.post("http://localhost:3000/api/offer-price",{
          Service_Id: activeRoom.Service_Id,
      Room_Id: activeRoom.Room_Id,
      Sender_Id: userId,
      Receiver_Id: getOtherUserId(activeRoom, userId),
      Price: price,
      Message: note},
      {
        headers:{authorization :token}
      })
      const newMsg = response.data.result
       socket.emit("send_message", newMsg) 
    setShowPriceModal(false)
    }catch(err){
        console.log(err)
      
    }
  }
  // -----------------------------------------------------
  //openPriceModal
  // -----------------------------------------------------
  const openPriceModal = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/readservice/${activeRoom.Service_Id}`, {
      headers: { authorization: token }
    })
    setServiceDetail(res.data.result)
  } catch (err) { console.log(err) }
  setShowPriceModal(true)
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
            const newMsg = res.data.result
            socket.emit("send_message",newMsg )  // ← ส่งให้อีกฝ่ายรับ real-time

    } catch (err) { console.log(err) }
  }

console.log(serviceUserId)

// เพิ่ม useEffect นี้ — ตอนเปลี่ยนห้อง ดึง service มาเช็ค
useEffect(() => {
  if (!activeRoom) return
  async function fetchService() {
    try {
      const res = await axios.get(`http://localhost:3000/api/readservice/${activeRoom.Service_Id}`, {
        headers: { authorization: token }
      })
      const s = res.data.result
      setServiceDetail(s)
      // ถ้า Users_Id ตรงกับ userId แสดงว่าเราคือช่าง
      setServiceUserId(s.Users_Id)
    } catch (err) { console.log(err) }
  }
  fetchService()
}, [activeRoom])


console.log(rooms)
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
{ /*--PRICE_OFFER-----------------------------------------------------------------------------------------------*/}
                      {msg.Type === "PRICE_OFFER" ? (
                        <div className="priceoffer" >
                          <p className="present">💰 เสนอราคางาน {msg.Title} </p>
                          <p className="presentprice">
                            ฿{msg.Price?.toLocaleString()} 
                          </p>
                          {msg.Message && msg.Message !== "เสนอราคา" && (
                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>{msg.Message}</p>
                          )}
                                    {userId !== serviceUserId &&(
                                                               <>
                                                                <button>ยืนยัน</button>
                                                                <button>ยกเลิก</button>
                                                               </>


                                    )}
                        </div>
                      ) : 
/*--Image-----------------------------------------------------------------------------------------------*/
                      msg.Type === "IMAGE" ? (
                          <div className="image-wrapper">

                        <img src={`http://localhost:3000/uploads/${msg.Image}`} className="ImageL" />
                       <div className="image-overlay">
                        <img 
                        src={`http://localhost:3000/uploads/${msg.Image}`} 
                        className="ImageL-preview" 
                      />
                    </div>
                        </div>
                      ) : 
/*--Message-----------------------------------------------------------------------------------------------*/
                      (
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

              {/* ปุ่มเสนอราคา — เฉพาะช่าง     idช่าง === UserId */}
              {serviceUserId === userId && (
                <button onClick={openPriceModal} className="imageinsert">
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
          service={serviceDetail}
          onSend={sendPrice}
        />
      )}

    </div>
  )
}

export default ChatPage