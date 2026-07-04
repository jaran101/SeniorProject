import axios from "axios";
import { useEffect, useState } from "react";

export default function Readservice() {
  // state สำหรับเก็บรายการบริการที่ดึงมาจาก API
  const [services, setServices] = useState([]);

  // ดึงข้อมูลบริการเมื่อ component ถูกแสดงครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    const id = userData?.payload?.id;

    // ฟังก์ชันสำหรับเรียก API เพื่อรับรายการบริการของผู้ใช้
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/readservice/${id}`, {
          headers: {
            authorization: token,
          },
        });
        setServices(response.data.result);
      } catch (error) {
        if (error.response?.status === 404) {
          alert("ไม่มีข้อมูล");
        }
        console.log(error);
      }
    };

    fetchServices();
  }, []);

  // แสดงรายการบริการทีละรายการบนหน้า UI
  return (
    <>
      {services.map((service) => (
        <div key={service.Service_Id}>
          <p>{service.Title}</p>
          <p>{service.Description}</p>
          <p>{service.Price} บาท</p>
          {service.Image && (
            <img
              src={`http://localhost:3000/uploads/${service.Image}`}
              width={150}
              alt={service.Title}
            />
          )}
        </div>
      ))}
    </>
  );
}