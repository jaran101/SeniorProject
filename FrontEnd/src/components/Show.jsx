import { useEffect, useState } from "react";
import axios from "axios";
import ShowService from "./showservice";

export default function Show({ data }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!data || typeof data !== "string") return; // ← กัน fetch ถ้าไม่ใช่ category
    const formatCategory = (data) => {
    if (data === "ไฟฟ้า") return "ELECTRICAL";
    if (data === "ประปา") return "PLUMBING";
    if (data === "ปรับอากาศ") return "AIR_CONDITIONER";
    if (data === "ทาสี") return "PAINTING";
    if (data === "โครงสร้าง") return "CONSTRUCTION";
    if (data === "เฟอร์นิเจอร์") return "FURNITURE";
    if (data === "ทำความสะอาด") return "CLEANING";
    if (data === "อื่นๆ") return "OTHER";
    return "-";
  };


  
    const fetchByCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/searchservicebycategory/${formatCategory(data)}` // ← ใช้ค่า data จริง
        );
        setServices(response.data.result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchByCategory();
  }, [data]); // ← เมื่อกด category ใหม่ จะ fetch ใหม่ทันที

  if (!data) return null;



const handleShow = (service) => {
   console.log(service); 

}



  // แสดงรายการ service ที่ดึงมาได้
  return (
    <div className="show-card">
      <div className="dd">
        <span className="show-category">ประเภทงาน : {data} </span>
        {services.length === 0 && <span className="show-category">ไม่พบบริการในหมวดนี้</span>}
        {services.length > 0 &&<span className="show-category">มี {services.length} รายการ</span>}
      </div>
        
      <div className="show-c2">
      {services.map((service) => (
        <div key={service.Service_Id} className="show-service" 
        onClick={() => setSelectedService(service)}>
          <img src={`http://localhost:3000/uploads/${service.Image}`} alt={service.Title} className="show-img" />
          <p>{service.Service_Id}</p>
          <p className="show-title">บริการ: {service.Title}</p>
          <p className="show-price">ราคา: {service.Price?.toLocaleString()}บาท</p>
        </div>
      ))}
    </div>
      {selectedService && (
  <div className="modal-overlay" onClick={() => setSelectedService(null)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setSelectedService(null)}>✕</button>
      <ShowService service={selectedService} data={data} />
    </div>
  </div>
)}
       </div>  
  );
}