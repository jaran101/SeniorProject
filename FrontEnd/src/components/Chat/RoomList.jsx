export default function RoomList({ rooms, onSelectRoom }) {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
      {rooms.map((room) =>
        <div key={room.Room_Id} onClick={() => onSelectRoom(room)}>
          <p>{room.otherUserName}</p>
          {/* TODO: เพิ่มบรรทัดแสดง room.otherUserName ไว้เหนือ room.Message */}
          <p>{room.Message}</p>
        </div>
      )}
    </div>
  );
}