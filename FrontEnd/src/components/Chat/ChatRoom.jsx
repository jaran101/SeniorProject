import { useState,useEffect,useRef } from "react";
import PriceOfferModal from "./PriceOfferModal";
import "./ChatRoom.css"
export default function ChatRoom({ room, messages, onSendMessage, currentUserId, isTechnician, onSendOffer,onAcceptOffer, onRejectOffer, showOfferModal, setShowOfferModal }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // TODO 2: สั่งเลื่อนไปหา messagesEndRef.current 
    //         hint: messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    //         ใส่ ?. ไว้กันกรณี ref ยังไม่ผูกกับ DOM element (เช่นตอน room เป็น null)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]); // ทำงานทุกครั้งที่ messages เปลี่ยน






//-------------------------
//useEffect Preview
//-------------------------
    useEffect(() => {
      if(!file){
        setPreviewUrl(null)
        return;
      }

      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)
  
    return ()=> URL.revokeObjectURL(previewUrl)
  }, [file]);

//------------------------- 
//Function HandleSend
//-------------------------
  if (!room) {
    return <p>ยังไม่ได้เลือกห้องแชท</p>;
  }
  function handleSend() {
    if(text.trim()==="" && !file)return;

    onSendMessage(text, file);
    setText("");
    setFile(null); 
  }
  //--------------------------------
  //Function handleFileChange
  //--------------------------------

  function handleFileChange(e) {

    const selectedFile = e.target.files?.[0] || null;
  setFile(selectedFile);

  }
//-----------
  function handleCancelFile() {
    setFile(null)
    fileInputRef.current.value = ""
}

function formatTime(dateString) {

  const date = new Date(dateString)
  return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("th-TH", { 
    day: "2-digit", month: "2-digit", year: "numeric" 
  });
}

//------------------------
//UI
//------------------------
  return (
    <div className="chat-room" >
      <div className="chat-header">
<h3>{room.otherUserName}</h3>
      
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) =>{
        const isMine = msg.Sender_Id === currentUserId;
        return(
<div key={index} className={`message ${isMine ? "mine" : "theirs"}`}>
  <div className="message-bubble-wrapper">
    {msg.Type === "IMAGE" && (
      <img className="MessageImage" src={`http://localhost:3000/uploads/${msg.Image}`} width={200} />
    )}

    {msg.Type === "MESSAGE" && (
      <p className={`BubbleMessage ${isMine ? "mine" : "theirs"}`}>{msg.Message}</p>
    )}

    {msg.Type === "PRICE_OFFER" && (
      <div>
        <p>ราคาเสนอ {msg.Price}บาท<br/>วันที่ทำงาน: {msg.Work_Date} - {msg.Work_Date_End}</p>
        {!isMine && (
          <>
            <button onClick={() => onAcceptOffer(msg)}>ยอมรับ</button>
            <button onClick={() => onRejectOffer(msg)}>ปฏิเสธ</button>
          </>
        )}
      </div>
    )}

    {msg.Type === "PRICE_ACCEPT" && (
      <div style={{ color: "green", fontWeight: "bold" }}>
        ยอมรับข้อเสนอราคาแล้ว
        <br />
        ราคา: {msg.Price} บาท | วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
      </div>
    )}

    {msg.Type === "PRICE_REJECT" && (
      <div style={{ color: "red" }}>
        ปฏิเสธข้อเสนอราคา
        <br />
        ราคา: {msg.Price} บาท | วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
      </div>
    )}

    <p className="message-time">{formatTime(msg.Created_At)}</p>
  </div>
</div>
  )
})}

 
                   <div ref={messagesEndRef} />
      </div>



        {showOfferModal && (
                <div className="chat-offer-modal">
                  
        <PriceOfferModal
        onSubmit={onSendOffer}
        onCancel={() => setShowOfferModal(false)}
        />
              </div>

      )}

<div className= "chat-input">
  

      {previewUrl && (
  <div>
    <img style={{ width: "200px" }} src={previewUrl} />
    <button  onClick={handleCancelFile}>ยกเลิก</button>
  </div>
)}
      <input ref={fileInputRef} 
      type="file" 
      accept="image/*" 
      onChange={handleFileChange}
      disabled={showOfferModal}
      />
      
      <input value={text}
      onChange={(e) => setText(e.target.value)}
      disabled={showOfferModal}
      />
      <button onClick={handleSend} disabled={showOfferModal}>
        ส่ง
      </button>
            {isTechnician && 
              <button onClick={
                () => setShowOfferModal(true)}
                disabled={showOfferModal}
                >เสนอราคา</button>}

    </div>
  </div>
  );
}
