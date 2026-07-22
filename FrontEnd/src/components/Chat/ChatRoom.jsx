import { useState,useEffect,useRef } from "react";

export default function ChatRoom({ room, messages, onSendMessage, currentUserId, isTechnician, onSendOffer,onAcceptOffer, onRejectOffer }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // TODO 0: ref สำหรับอ้างอิง input
 const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
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

//-------------------------
//Function HandleOfferSubmit
//-------------------------
  function handleOfferSubmit() {
    // TODO 1: เช็คว่ากรอกครบทั้ง 3 ช่องไหม (ถ้าไม่ครบ return ออกไปเลย ไม่ต้องส่ง)
    if(!offerPrice || !offerStartDate || !offerEndDate){
      return
    }
    // TODO 2: เรียก onSendOffer(...) ส่งค่าที่กรอกไป (ยังไม่ต้องเขียนฟังก์ชันนี้จริง 
    //         จะไปเขียนใน ChatContainer.jsx ขั้นต่อไป)
    onSendOffer({
      price:offerPrice,
      startDate:offerStartDate,
      endDate:offerEndDate,
      
    })
    setShowOfferModal(false)
    setOfferPrice("")
    setOfferStartDate("")
    setOfferEndDate("")
    
  }

//------------------------
//UI
//------------------------
  return (
    <div style={{ flex: 1, padding: "16px" }}>
<h3>{room.otherUserName}</h3>
   
      {isTechnician && <button onClick={() => setShowOfferModal(true)}>เสนอราคา</button>}
      {showOfferModal && (
  <div style={{ border: "1px solid #ccc", padding: "16px", margin: "8px 0" }}>
    <h4>เสนอราคา</h4>
    <input 
      type="number" 
      placeholder="ราคา" 
      value={offerPrice} 
      onChange={(e) => setOfferPrice(e.target.value)} 
    />
    <input 
      type="date" 
      value={offerStartDate} 
      onChange={(e) => setOfferStartDate(e.target.value)} 
    />
    <input 
      type="date" 
      value={offerEndDate} 
      onChange={(e) => setOfferEndDate(e.target.value)} 
    />
    <button onClick={handleOfferSubmit}>ยืนยัน</button>
    <button onClick={() => setShowOfferModal(false)}>ยกเลิก</button>
  </div>
)}
      
      <div>
        {messages.map((msg, index) =>{
        const isMine = msg.Sender_Id === currentUserId;
        return(
  <div key={index} style={{ 
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start"
                }}>

      {msg.Type === "IMAGE" && 
      <div><img src={`http://localhost:3000/uploads/${msg.Image}`} width={200} />
      {formatTime(msg.Created_At)}</div>}
      {msg.Type === "MESSAGE" && <p>{msg.Message}{formatTime(msg.Created_At)}</p>}
      {msg.Type === "PRICE_OFFER"&& <div>
        <p>ราคาเสนอ {msg.Price}บาท<br/>วันที่ทำงาน: {msg.Work_Date} - {msg.Work_Date_End}</p>
        {formatTime(msg.Created_At)}
        {!isMine && (
          <>
            {msg.Type === "PRICE_OFFER" && <div>
              <button onClick={() => onAcceptOffer(msg)}>ยอมรับ</button>
            <button onClick={() => onRejectOffer(msg)}>ปฏิเสธ</button>
              </div>}
          </>
        )}</div>}
        {msg.Type === "PRICE_ACCEPT" && (
          <div style={{ color: "green", fontWeight: "bold" }}>
            ยอมรับข้อเสนอราคาแล้ว
            <br />
            ราคา: {msg.Price} บาท | วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
            <br />
            {formatTime(msg.Created_At)}
          </div>
)}

          {msg.Type === "PRICE_REJECT" && (
            <div style={{ color: "red" }}>
              ปฏิเสธข้อเสนอราคา
              <br />
              ราคา: {msg.Price} บาท | วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
              <br />
              {formatTime(msg.Created_At)}
            </div>
          )}
  </div>
  )
})}
      </div>
      {previewUrl && (
  <div>
    <img style={{ width: "200px" }} src={previewUrl} />
    <button  onClick={handleCancelFile}>ยกเลิก</button>
  </div>
)}
      <input ref={fileInputRef} 
      type="file" accept="image/*" 
      onChange={handleFileChange} />
      
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSend}>ส่ง</button>
    </div>
  );
}