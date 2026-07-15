import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import "./ShowService.css";


export default function ShowService({ service ,data }) {
//------------------------------------------------------------------------------------------------------------
//state
//------------------------------------------------------------------------------------------------------------
    const [user, setUser] = useState(null);  
    const navigate = useNavigate();
    const [receiverData, setReceiverData] = useState(null);
    const userId = Number(localStorage.getItem("id"))
    const receiverId = service?.Users_Id;

//------------------------------------------------------------------------------------------------------------
//โหลดข้อมูลผู้ใช้ที่เป็นเจ้าของบริการ
//------------------------------------------------------------------------------------------------------------      
  useEffect(() => {
      const fethuser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/readprofile/${receiverId}`, {
            headers: { authorization: localStorage.getItem("token") },
          }
        );
          setReceiverData(response.data.result)
          console.log("โหลดข้อมูลสำเร็จ:", response.data);
        } catch (error) {
          console.log("โหลดข้อมูลไม่สำเร็จ:", error);
          console.log("error:", error.response?.data);
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่: " + error.response?.data?.msg);
        }
      };
      fethuser();
    },[receiverId]);


//-----------------------------------------------------------------------------------------------------------------------------
//UI
//-----------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="BBK">
      <div className="container">
      <img className="imgservice"
        src={`http://localhost:3000/uploads/${service.Image}`}
        alt={service.Title}
      />
      <p>{service.Users_Id}</p>
      <p><strong>บริการ:</strong> {service.Title}</p>
      <p><strong>รายละเอียด:</strong> {service.Description}</p>
      <p><strong>ราคา:</strong> {service.Price?.toLocaleString()} บาท</p>
      <p><strong>ประเภทงาน:</strong> {data}</p>
      <div className="user">
                <div className="imageUser">
                  <img className="imguser" src={`http://localhost:3000/uploads/${receiverData?.Avatar ?? 
                  service.Avatar}`} alt="avatar" width={120} />
                </div>
        <p  className="techName">
          ผู้รับงาน: {receiverData?.First_Name ?? service.First_Name}{" "}
          {receiverData?.Last_Name ?? service.Last_Name}
        </p>
      
</div>
   
</div>
    </div>
  );
}