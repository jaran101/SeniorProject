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
  "งานทั้งหมด": null,
};

export default function Show({ category, searchText }) {
  // state สำหรับเก็บรายการบริการและบริการที่ถูกเลือกเพื่อแสดงรายละเอียด
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null); 
  const hideNoProvinceMessage = !category || categoryMap[category] === null;
  //------------------------------------------------------------------------------------------------------------
// โหลดบริการตามหมวดหมู่เมื่อ prop data เปลี่ยน
//------------------------------------------------------------------------------------------------------------
useEffect(()=>{
  const fetchData = async () => {
  try {
    let response;
    const categoryCode = category ? categoryMap[category] : null;

    if (categoryCode) {
      response = await axios.get(`http://localhost:3000/api/searchservices?Category=${categoryCode}`);
      
    } else if (searchText) {
      response = await axios.get(`http://localhost:3000/api/searchservices?q=${searchText}`);
    } else {
      response = await axios.get(`http://localhost:3000/api/listservice`);
    }

    setAllServices(response.data.result);
  } catch (err) {
    console.log(err.response?.data?.message || err.message);
  }
};
fetchData()
},[category, searchText])

useEffect(() => {
  if (!allServices) return;
  const allProvinces = new Set();
  allServices.forEach((service) => {
    service.User?.ServiceAreas?.forEach((area) => {
      allProvinces.add(area.Province);
    });
  });
  setProvinces(Array.from(allProvinces));
}, [allServices]);

useEffect(() => {
  if (!selectedProvince) {
    setServices(allServices);
    return;
  }
 const filteredServices = allServices.filter((service) =>
  service.User?.ServiceAreas?.some((area) => area.Province === selectedProvince)
);
  setServices(filteredServices);
}, [allServices, selectedProvince]);




const headerText = category
  ? `ประเภทงาน : ${category}`
  : searchText
  ? `ผลการค้นหา : ${searchText}`
  : `บริการทั้งหมด`;


  //------------------------------------------------------------------------------------------------------------  
//UI
//------------------------------------------------------------------------------------------------------------
  return (
    <div className="show-card">
      <div className="dd">
        <span className="show-category">{headerText}</span>
        {services.length === 0 && (
          <span className="show-category">ไม่พบบริการในหมวดนี้</span>
        )}
        {services.length > 0 && (
          <span className="show-category">มี {services.length} รายการ</span>
        )}
        
          
      </div>

        <div className="province-buttons">
          {provinces.length === 0 ? (
            hideNoProvinceMessage ? "" : (
              <span className="show-category">ไม่พบพื้นที่ให้บริการ</span>
            )
          ) : (
            provinces.map((p) => (
              <button
                key={p}
                className={selectedProvince === p ? "active" : ""}
                onClick={() => setSelectedProvince(prev => prev === p ? "" : p)}
              >
                {p}
              </button>
            ))
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
            <ShowService service={selectedService} data={category} />
          </div>
        </div>
      )}
    </div>
  );
}
