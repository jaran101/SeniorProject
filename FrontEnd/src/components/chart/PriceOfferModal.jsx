import { useState } from "react";
import "./PriceOfferModal.css"

export default function PriceOfferModal({ onClose, onSend, service }) {  
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [date,setDate]= useState("");
  const [dateEnd,setDateEnd] = useState("");
  const handleConfirm = () => {
    if (!price || Number(price) <= 0) {
      alert("กรุณาระบุค่าบริการ")
      return
    }
  if(!date){
    alert("กรุณาระบุวันเริ่มงาน")
    return
  }
  if(!dateEnd){
    alert("กรุณาระบุวันสิ้นสุดงาน")
    return
  }
    onSend(price, note ,date,dateEnd)
  }
  return (
    <div className="main">
      <div className="m2">
        <h3 style={{ margin: 0 }}> เสนอราคา</h3>

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
          className="lastprice"
          />
        </div>
        {/*ช่องระบุวันเริ่มงาน*/}
        <div>
          <input type="date" placeholder="ระบุวันเริ่มงาน" value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>
        {/*ช่องระบุวันสิ้นสุดงาน*/}
        <div>
          <input type="date" placeholder="ระบุวันเริ่มงาน" value={dateEnd} onChange={(e)=>setDateEnd(e.target.value)} />
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

