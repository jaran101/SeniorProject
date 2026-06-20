import axios from "axios";
import Show from "./Show";
import { useState, useEffect } from "react";

export default function Home() {

  // ── State ──────────────────────────────────────────────
  const [text, setText] = useState("");           // ข้อความในช่องค้นหา
  const [selectedItem, setSelectedItem] = useState(null); // item ที่เลือกอยู่
  const [data, setData] = useState([]);           // ข้อมูลทั้งหมดจาก API
  const [loading, setLoading] = useState(true);   // สถานะโหลดข้อมูล
  const [f,setF]=useState(['ไฟฟ้า','ประปา','ปรับอากาศ','ทาสี','โครงสร้าง','เฟอร์นิเจอร์','ทำความสะอาด','อื่นๆ']);


  // ── Fetch API ──────────────────────────────────────────
  //const dataF = async () => {
    //try {
      //const response = await axios.get("https://dummyjson.com/products");
      //setData(response.data.products);
    //} catch (error) {
     // console.log(error);
    //} finally {
      //setLoading(false); // ปิด loading ไม่ว่าจะสำเร็จหรือไม่
    //}
  //};

  // โหลดข้อมูลครั้งเดียวตอน component mount
  // useEffect(() => {
  //   dataF();
  // }, []);


  // ── Handler ────────────────────────────────────────────
  // กดปุ่มเลือก item
  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  // กด Enter ในช่องค้นหา
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      alert(text);
    }
  };

  // กรองข้อมูลตามคำค้นหา (real-time)
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(text.toLowerCase())
  );


  // ── Render ─────────────────────────────────────────────
  return (
    <>

      {/* ── Hero text ── */}
      <h1 className="f1">เรียกช่างใกล้บ้าน ง่าย รวดเร็ว ไว้ใจได้</h1>
      <p className="f2">รวมช่างมืออาชีพหลากหลายประเภท</p>
      <p className="f2">พร้อมรีวิวจากผู้ใช้จริง</p>

      <hr className="line" />

      {/* ── ช่องค้นหา ── */}
      <input
        type="text"
        className="i3"
        placeholder="ค้นหาช่าง..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSearch}
      />

      <br />
      <p className="f1">เลือกประเภท</p>
      <br />
      <hr className="line" />
      <br />

      {/* ── ปุ่มประเภท ── */}
      <div className="job-scroll">

        {f.map((item) => (
          <button
            className={`button2 ${selectedItem === item? "active" : ""}`}
            key={item}  onClick={() => handleSelect(item)}>
            {item}
          </button>)
        )}



        {/* แสดง loading ระหว่างรอข้อมูล */}
        {/*loading && <p className="f2">กำลังโหลด...</p>}

        {/* แสดงปุ่มจาก filteredData แทน data 
            เพื่อให้ค้นหาแบบ real-time ได้เลย */}
        {/*!loading && filteredData.length === 0 && (
          <p className="f2">ไม่พบผลลัพธ์</p>
        )*/}

        {/*filteredData.map((item) => (
          <button
            className={`button2 ${selectedItem?.id === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => handleSelect(item)}
          >
            {item.title}
          </button>
        ))*/}
      </div>
        {/* ── แสดงรายละเอียด item ที่เลือก ── */}

      <div className="show">
        {selectedItem && (
          <>
            {/* ปุ่มปิด */}
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