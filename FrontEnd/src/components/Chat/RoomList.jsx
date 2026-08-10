import "./RoomList.css"



export default function RoomList({ rooms, onSelectRoom,disabled }) {
  
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
  return room.Message;
}



  return (
    <div style={{ width: "250px", 
    borderRight: "1px solid #ccc" ,
    opacity: disabled ? 0.5 : 1,        
      pointerEvents: disabled ? "none" : "auto"  
    }}>
      {rooms.map((room) =>
        <div key={room.Room_Id} onClick={() => handleClick(room)} className="room-item">
          <p>{room.otherUserName}</p>
          <p className="message-preview">{previewMessage(room)}</p>
        </div>
      )}
    </div>
  );
}
