import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import PriceOfferModal from "./PriceOfferModal";
import Boq from "./Boq.jsx"
import "./ChatRoom.css"
import useMatchedOrder from "./useMatchedOrder";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BOQDocument from "./BOQDocument.jsx";
import BOQPreview from "./BOQPreview.jsx";

import axios from "axios";
export default function ChatRoom({ room, messages, onSendMessage, currentUserId, isTechnician, 
  onSendOffer,onAcceptOffer, onRejectOffer, showOfferModal, setShowOfferModal, otherUserId }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); 
  const messagesEndRef = useRef(null);
  const [showBOQ,setShowBOQ] = useState(false);
  const [viewingBoq, setViewingBoq] = useState(null);
  const Tech_Id = room ? (isTechnician ? currentUserId : otherUserId) : null;
  const User_Id = room ? (isTechnician ? otherUserId : currentUserId) : null;
    const navigate = useNavigate();

  // -------------------------
  // Hook
  // -------------------------

  const {orderId,loading,error} = useMatchedOrder(
    Tech_Id,
    room?.Service_Id,
    User_Id,
    null
  );

useEffect(() => {
  if (error) {
    console.warn("useMatchedOrder error:", error);
  }
}, [error]);



//-------------------------
//useEffect Preview
//-------------------------
console.log({ Tech_Id, User_Id, Service_Id: room?.Service_Id, orderId, isTechnician });
    useEffect(() => {
      if(!file){
        setPreviewUrl(null)
        return;
      }

      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)
  
    return ()=> URL.revokeObjectURL(previewUrl)
  }, [file]);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);






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
    fileInputRef.current.value = ""

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
//handle BOQ
//------------------------
const handleViewBoq = async(msg)=>{
  try{

    const response = await axios.get(`http://localhost:3000/api/readboqorder/${msg}`);
    // setViewingBoq(response.data.result);
    console.log(response.data.result)
         navigate(`/BOQPreview`,{state:{items:mapItemsForPdf(response.data.result.Items)}});
  }catch(err){
    console.error(err.response?.data?.message || err.message);
  }
}

function mapItemsForPdf(items) {
  return items.map((item) => ({
    id: item.BOQ_Item_Id, 
    name: item.Name,
    quantity: item.Quantity,
    unitPrice: item.Unit_Price,
    unit: item.Unit,
    description: item.Description
  }));
}



//------------------------
//UI
//------------------------
  return (
    <div className="chat-room" >
      <div className="chat-header">
<p className="HeaderName">{room.otherUserName}</p>
      
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) =>{
        const isMine = msg.Sender_Id === currentUserId;
        return(
<div key={msg.Chat_Id} className={`message ${isMine ? "mine" : "theirs"}`}>
  <div className="message-bubble-wrapper">
    {msg.Type === "IMAGE" && (
      <img className="MessageImage" src={`http://localhost:3000/uploads/${msg.Image}`} width={200} />
    )}

    {msg.Type === "PRICE_OFFER" && (
      <div>
        <p className={`message ${isMine ? "mine" : "theirs"}`}>ราคาเสนอ 
          {msg.Price}บาท<br/>วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}</p>
        {!isMine && (
          <>
            <button onClick={() => onAcceptOffer(msg)}>ยอมรับ</button>
            <button onClick={() => onRejectOffer(msg)}>ปฏิเสธ</button>
          </>
        )}
      </div>
    )}

    {msg.Type === "MESSAGE" && msg.Message?.split(":")[0] === "BOQ_CREATED" && (
  <button onClick={() => handleViewBoq(msg.Message.split(":")[1])}>ดูใบเสนอราคา</button>
)}

{msg.Type === "MESSAGE" && msg.Message?.split(":")[0] !== "BOQ_CREATED" && (
  <p className={`BubbleMessage ${isMine ? "mine" : "theirs"}`}>{msg.Message}</p>
)}


    {msg.Type === "PRICE_ACCEPT" && (
      <div className="PRICE_ACCEPT">
        ยอมรับข้อเสนอราคาแล้ว
        <p>ราคา: {msg.Price} บาท</p>
          วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
      </div>
    )}

    {msg.Type === "PRICE_REJECT" && (
      <div className="PRICE_REJECT">
        ปฏิเสธข้อเสนอราคา
        <p>ราคา: {msg.Price} บาท</p>
      วันที่ทำงาน: {formatDate(msg.Work_Date)} - {formatDate(msg.Work_Date_End)}
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
        Service_Id={room.Service_Id} 
        />
              </div>

      )}

    { showBOQ && (
                <div className="chat-Boq-modal">
        <Boq
        onCancel={() => setShowBOQ(false)}
        showBOQ={showBOQ}
        setShowBOQ={setShowBOQ}
        orderId={orderId}
        onSendMessage={onSendMessage}
        />
        </div>
    )}


 {/* {viewingBoq && (
//   <div className="chat-View-Boq-modal">
//     <button onClick={() => setViewingBoq(null)}>ปิด</button>
//     <p>รายการใบเสนอราคา</p>
//     <table>
//       <thead>
//         <tr>
//           <th>ชื่อ</th>
//           <th>จำนวน</th>
//           <th>หน่วย</th>
//           <th>ราคาต่อหน่วย</th>
//           <th>ราคารวม</th>
//           <th>รายละเอียด</th>
//         </tr>
//       </thead>
//       <tbody>
//     {viewingBoq?.Items?.map((item) => (   
//       <tr key={item.BOQ_Item_Id}> 
//       <td>{item.Name}</td> 
//       <td>{item.Quantity}</td> 
//       <td>{item.Unit}</td> 
//       <td>{item.Unit_Price}</td> 
//       <td>{item.Total_Price}</td>
//       <td>{item.Description}</td>
//       </tr>
//     ))}
//       </tbody>
//     </table>
//     <p>ยอดรวมทั้งหมด: {viewingBoq?.Total_Amount}</p>
//     <p>หมายเลขอ้างอิง: {viewingBoq?.Order_Id}</p> 
//     <PDFDownloadLink document={<BOQDocument items={mapItemsForPdf(viewingBoq.Items)} />} fileName="BOQ.pdf">
//   {({ loading }) => (loading ? "Generating PDF..." : "Download BOQ")}
// </PDFDownloadLink>
//     <BOQPreview items={mapItemsForPdf(viewingBoq.Items)} />
    
//   </div>
)} */}


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

                {isTechnician && 
                  <button onClick={() => setShowBOQ(!showBOQ)} disabled={showOfferModal || loading || !orderId}>
        {showBOQ ?"ปิดรายการ" : "สร้างรายการ"}</button>
                }
    </div>
  </div>
  );
}
