import { useState } from "react";


const  PriceOfferModal = ({ onClose, onSend }) => {
const [price, setPrice] = useState("");
const [note, setNote] = useState("");

const handleConfirm = () => {
if(!price || Number(price)<=0){
alert("กรุณาระบุค่าบริการ")
return
    }
onSend(price, note)
}

return(
        // overlay พื้นหลังมืด
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999
    }}>
      {/* กล่อง modal */}
      <div style={{
        background: "#fff", borderRadius: "12px",
        padding: "24px", width: "320px",
        display: "flex", flexDirection: "column", gap: "16px"
      }}>
        <h3 style={{ margin: 0 }}>💰 เสนอราคา</h3>
      <h1>{Service_Id}</h1>
        {/* ช่องกรอกราคา */}
        <div>
          <label style={{ fontSize: "14px", color: "#555" }}>
            ราคา (บาท)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="เช่น 500"
            style={{ width: "100%", padding: "8px", marginTop: "4px",
              borderRadius: "8px", border: "1px solid #ccc",
              fontSize: "16px", boxSizing: "border-box" }}
          />
        </div>

        {/* ช่องกรอกหมายเหตุ */}
        <div>
          <label style={{ fontSize: "14px", color: "#555" }}>
            หมายเหตุ (ไม่บังคับ)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น รวมค่าแรงและอุปกรณ์"
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "4px",
              borderRadius: "8px", border: "1px solid #ccc",
              resize: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* ปุ่ม */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px", border: "1px solid #ccc",
              borderRadius: "8px", background: "#fff", cursor: "pointer" }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            style={{ flex: 1, padding: "10px", border: "none",
              borderRadius: "8px", background: "#e37f22",
              color: "#fff", cursor: "pointer", fontWeight: "600" }}
          >
            ส่งราคา
          </button>
        </div>
      </div>
    </div>
)

};

export default PriceOfferModal