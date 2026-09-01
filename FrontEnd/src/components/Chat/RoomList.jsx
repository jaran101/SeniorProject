import "./RoomList.css"



export default function RoomList({ rooms, onSelectRoom,disabled }) {
console.log(rooms);  
  function handleClick(room) {

    if (disabled) {return;}
    onSelectRoom(room);

  }
  

function previewMessage(room) {
  if (room.Type === "IMAGE") {   
    return "ส่งรูปภาพ";
  }
  if (room.Type === "PRICE_OFFER" || room.Type === "PRICE_ACCEPT" || room.Type === "PRICE_REJECT") {
    return "ข้อเสนอราคา";
  }
  if(room.Message.split(":")[0] === "BOQ_CREATED"){
    return "ดูใบเสนอราคา";
  }
  return room.Message;
}



  return (
    <div style={{ width: "250px", 
    borderRight: "1px solid #311c1cff" ,
    opacity: disabled ? 0.5 : 1,        
    pointerEvents: disabled ? "none" : "auto"  
    }}>
      {rooms.map((room) =>
        <div key={room.Room_Id} onClick={() => handleClick(room)} className="Room-Chat"  >
          {room.otherUserAvatar && (
            <img
              src={`http://localhost:3000/uploads/${room.otherUserAvatar}`}
              alt="Avatar"
              className="Room-Chat-Avatar"
              />
            )}
            <div className="Room-Chat-Info">
            <span>{room.otherUserName}</span>
           <p className="message-preview">{previewMessage(room)}</p>
            </div>
        </div>
      )}
    </div>
  );
}
