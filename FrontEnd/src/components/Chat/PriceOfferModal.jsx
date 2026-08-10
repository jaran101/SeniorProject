import { useState } from "react";
import BOQTable from "./BOQTable";
export default function PriceOfferModal({ onSubmit, onCancel }) {
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

  function handleBOQTotalChange(total) {
    // TODO 2: เอาค่า total ที่ได้มา ไปใส่ใน setPrice
    setPrice(total);
}


    function handleSubmit() {
    if (!price || !startDate || !endDate) {
    return;
    }
    onSubmit({ price, startDate, endDate });
 
    
    onCancel();
}

    return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "8px 0" }}>
   <BOQTable onTotalChange={handleBOQTotalChange} />
    <h4>เสนอราคา</h4>
    <input type="number" placeholder="ราคา" value={price} onChange={(e) => setPrice(e.target.value)} />
    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
    <button onClick={handleSubmit}>ยืนยัน</button>
    <button onClick={onCancel}>ยกเลิก</button>
    </div>
    );
}