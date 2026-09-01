import { useEffect, useState } from "react";
import axios from "axios";
export default function PriceOfferModal({ onSubmit, onCancel,Service_Id }) {
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [service, setService] = useState(null);
  




    function handleSubmit() {
    if (!price || !startDate || !endDate) {
    return;
    }
    onSubmit({ price, startDate, endDate });
 
    
    onCancel();
}

useEffect(() => {

  const fetchService = async()=>{

    try{
        const response = await axios.get(`http://localhost:3000/api/readservice/${Service_Id}`)
        setService(response.data.result);
        console.log(response.data.result);


    }catch(error){
        console.log(error.response?.data?.message);
    }
  }
fetchService()

}, [Service_Id]);





    return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "8px 0" }}>
      <p>Service_Id: {Service_Id}</p>
   {service && (
  <div>
    <p>Service ID: {service.Service_Id}</p>
    <p>Title: {service.Title}</p>
    <p>Category: {service.Category}</p>
    <p>Description: {service.Description}</p>
  </div>
)}
    <h4>เสนอราคา</h4>
    <input type="number" placeholder="ราคา" value={price} onChange={(e) => setPrice(e.target.value)} />
    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
    <button onClick={handleSubmit}>ยืนยัน</button>
    <button onClick={onCancel}>ยกเลิก</button>
    </div>
    );
}