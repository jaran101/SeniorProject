import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import "./ShowService.css";
import { generateRoomId } from "../../utils/generateRoomId"; // ปรับ path ตามจริง


export default function ShowService({ service}) {
//------------------------------------------------------------------------------------------------------------
//state
//------------------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const [receiverData, setReceiverData] = useState(null);
    const [area, setArea] = useState([]);
    const userId = JSON.parse(localStorage.getItem("user"))?.payload?.id
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


    useEffect(()=>{

      const fetchmyservicearea = async () => {
        try{
          const response = await axios.get(`http://localhost:3000/api/readmyservicearea/${receiverId}`, {
            headers: { authorization: localStorage.getItem("token") },
          })
          console.log(response.data.result)
          setArea(response.data.result)
        }catch(error){
          console.log(error.response.data.message)
        }
      }
      if (receiverId) fetchmyservicearea()
    },[receiverId])


//-----------------------------------------------------------------------------------------------------------------------------
//สร้าง room
//-----------------------------------------------------------------------------------------------------------------------------
function handleChatClick() {

  const roomId = generateRoomId(service?.Service_Id, userId, receiverId);

  navigate("/chat",{
    state:{
      Room_Id: roomId,
      Service_Id: service?.Service_Id,
      Sender_Id: userId,
      Receiver_Id: receiverId,
      Tech_Id: receiverId,  
      Users_Id: userId,     
      otherUserName: `${receiverData?.First_Name ?? service?.First_Name} ${receiverData?.Last_Name ?? service?.Last_Name}`,
      message: "สนใจงานบริการนี้ครับ"
    }
  })
}

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
      <p><strong>ประเภทงาน:</strong> {service.Category}</p>
        <p>พื้นที่ให้บริการ</p>
      <div className="area">
        {area.length > 0 ? (
          area.map((item) => (
            <div
              key={item.Area_Id}
            >
              <p className="province">{item.Province}</p>
            </div>
          ))
        ) : (
          <p>ยังไม่มีพื้นที่ให้บริการ</p>
        )}
      </div>
      
      
      
      <div className="user">
                <div className="imageUser">
                  <img className="imguser" src={`http://localhost:3000/uploads/${receiverData?.Avatar ?? 
                  service.Avatar}`} alt="avatar" width={120} />
                </div>
        <p  className="techName">
          ผู้รับงาน: {receiverData?.First_Name ?? service.First_Name}{" "}
          {receiverData?.Last_Name ?? service.Last_Name}
        </p>
      <button className="buttonMessage" onClick={handleChatClick}>ติดต่อผู้รับงาน</button>
</div>
   
</div>
    </div>
  );
}