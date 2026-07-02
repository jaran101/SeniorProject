import { useState } from "react";
import Show from "./Show";

export default function Home() {
  const [text, setText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories] = useState([
    "ไฟฟ้า",
    "ประปา",
    "ปรับอากาศ",
    "ทาสี",
    "โครงสร้าง",
    "เฟอร์นิเจอร์",
    "ทำความสะอาด",
    "อื่นๆ",
  ]);

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      alert(text);
    }
  };

  return (
    <>
      <h1 className="f1">เรียกช่างใกล้บ้าน ง่าย รวดเร็ว ไว้ใจได้</h1>
      <p className="f2">รวมช่างมืออาชีพหลากหลายประเภท</p>
      <p className="f2">พร้อมรีวิวจากผู้ใช้จริง</p>

      <hr className="line" />

      <input
        type="text"
        className="i3"
        placeholder="ค้นหาช่าง..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleSearch}
      />

      <br />
      <p className="f1">เลือกประเภท</p>
      <br />
      <hr className="line" />
      <br />

      {/* ── ปุ่มประเภท ── */}
      <div className="job-scroll">
        {categories.map((item) => (
          <button
            className={`button2 ${selectedItem === item ? "active" : ""}`}
            key={item}
            onClick={() => handleSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="show">
        {selectedItem && (
          <>
            <button className="buttonRed" onClick={() => setSelectedItem(null)}>
              X
            </button>
            <Show data={selectedItem} />
          </>
        )}
      </div>
    </>
  );
}