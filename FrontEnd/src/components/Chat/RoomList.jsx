import "./RoomList.css"
export default function RoomList({ rooms, onSelectRoom }) {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
      {rooms.map((room) =>
        <div key={room.Room_Id} onClick={() => onSelectRoom(room)} className="room-item">
          <p>{room.otherUserName}</p>
          <p className="message-preview">{room.Message}</p>
        </div>
      )}
    </div>
  );
}
