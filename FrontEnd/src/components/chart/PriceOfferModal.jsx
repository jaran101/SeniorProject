import { useState } from "react";
import "./PriceOfferModal.css"
const PriceOfferModal = ({ onClose, onSend, service }) => {  // ← เพิ่ม service
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!price || Number(price) <= 0) {
      alert("กรุณาระบุค่าบริการ")
      return
    }
    onSend(price, note)
  }
console.log(service.Description)
  return (
    <div className="main">
      <div className="m2">
        <h3 style={{ margin: 0 }}>💰 เสนอราคา</h3>

        {/* รายละเอียดงาน */}
        {service && (
          <div className="m3">
            <p className="ServiceName1">
              {service.Title}
            </p>
            <p className="Cade">
              หมวดหมู่: {service.Category}
            </p>
            <p className="Cade">
              รายละเอียด: {service.Description}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#e37f22", fontWeight: 600 }}>
              ราคาเริ่มต้น: ฿{Number(service.Price).toLocaleString()}
            </p>
            <img className="imgservice1"
        src={`http://localhost:3000/uploads/${service.Image}`}
        alt={service.Title}
      />

          </div>
        )}

        {/* ช่องกรอกราคา */}
        <div>
          <label style={{ fontSize: "14px", color: "#555" }}>ราคา (บาท)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="เช่น 500"
            style={{
              width: "100%", padding: "8px", marginTop: "4px",
              borderRadius: "8px", border: "1px solid #ccc",
              fontSize: "16px", boxSizing: "border-box"
            }}
          />
        </div>

        {/* ช่องกรอกหมายเหตุ */}
        <div>
          <label style={{ fontSize: "14px", color: "#555" }}>หมายเหตุ (ไม่บังคับ)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น รวมค่าแรงและอุปกรณ์"
            rows={3}
            className="D1"
          />
        </div>

        {/* ปุ่ม */}
        <div className="BB">
          <button
            onClick={onClose}
           className="CC"
          >ยกเลิก</button>
          <button
            onClick={handleConfirm}
            className="SS"
          >ส่งราคา</button>
        </div>
      </div>
    </div>
  )
}

export default PriceOfferModal