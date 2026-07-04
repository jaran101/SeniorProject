import { useEffect, useState } from "react";
import axios from "axios";
import ShowService from "./showservice";

// แปลงชื่อหมวดหมู่ที่แสดงใน UI เป็นรหัสหมวดหมู่ที่ API ใช้
const categoryMap = {
  ไฟฟ้า: "ELECTRICAL",
  ประปา: "PLUMBING",
  ปรับอากาศ: "AIR_CONDITIONER",
  ทาสี: "PAINTING",
  โครงสร้าง: "CONSTRUCTION",
  เฟอร์นิเจอร์: "FURNITURE",
  ทำความสะอาด: "CLEANING",
  "อื่นๆ": "OTHER",
};

export default function Show({ data }) {
  // state สำหรับเก็บรายการบริการและบริการที่ถูกเลือกเพื่อแสดงรายละเอียด
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
//------------------------------------------------------------------------------------------------------------
// โหลดบริการตามหมวดหมู่เมื่อ prop data เปลี่ยน
//------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (!data || typeof data !== "string") {
      return;
    }

    const fetchByCategory = async () => {
      try {
        const categoryCode = categoryMap[data] || "-";
        const response = await axios.get(
          `http://localhost:3000/api/searchservicebycategory/${categoryCode}`
        );
        setServices(response.data.result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchByCategory();
  }, [data]);

  // ถ้าไม่มีหมวดหมู่ที่เลือกให้ไม่แสดงอะไร
  if (!data) {
    return null;
  }
//------------------------------------------------------------------------------------------------------------  
//UI
//------------------------------------------------------------------------------------------------------------
  return (
    <div className="show-card">
      {/* ส่วนหัวของหมวดหมู่และสถิติจำนวนรายการ */}
      <div className="dd">
        <span className="show-category">ประเภทงาน : {data}</span>
        {services.length === 0 && (
          <span className="show-category">ไม่พบบริการในหมวดนี้</span>
        )}
        {services.length > 0 && (
          <span className="show-category">มี {services.length} รายการ</span>
        )}
      </div>

      {/* แสดงรายการบริการในหมวดหมู่นั้น ๆ */}
      <div className="show-c2">
        {services.map((service) => (
          <div
            key={service.Service_Id}
            className="show-service"
            onClick={() => setSelectedService(service)}
          >
            <img
              src={`http://localhost:3000/uploads/${service.Image}`}
              alt={service.Title}
              className="show-img"
            />
            <p>{service.Service_Id}</p>
            <p className="show-title">บริการ: {service.Title}</p>
            <p className="show-price">ราคา: {service.Price?.toLocaleString()}บาท</p>
          </div>
        ))}
      </div>

      {/* Modal สำหรับแสดงรายละเอียดบริการที่เลือก */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedService(null)}>
              ✕
            </button>
            <ShowService service={selectedService} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}