import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./ShowService.css";
import { generateRoomId } from "../../utils/generateRoomId";

export default function ShowService({ service }) {
  const navigate = useNavigate();
  const [receiverData, setReceiverData] = useState(null);
  const [area, setArea] = useState([]);
  const [review, setReview] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"))?.payload?.id;
  const receiverId = service?.Users_Id;
  const token = localStorage.getItem("token");

  // โหลดข้อมูลผู้ใช้ที่เป็นเจ้าของบริการ
  useEffect(() => {
    const fetchUser = async () => {
      if (!receiverId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/readprofile/${receiverId}`,
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );

        setReceiverData(response.data.result);
      } catch (error) {
        console.log("โหลดข้อมูลไม่สำเร็จ:", error);
        console.log("error:", error.response?.data);
        alert(
          "เกิดข้อผิดพลาด กรุณาลองใหม่: " +
            (error.response?.data?.msg || "")
        );
      }
    };

    fetchUser();
  }, [receiverId]);

  // โหลดพื้นที่ให้บริการ
  useEffect(() => {
    const fetchMyServiceArea = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readmyservicearea/${receiverId}`
        );
        setArea(response.data.result || []);
      } catch (error) {
        console.log("โหลดพื้นที่ให้บริการไม่สำเร็จ:", error);
      }
    };

    if (receiverId) fetchMyServiceArea();
  }, [receiverId]);

  function handleChatClick() {
    const roomId = generateRoomId(service?.Service_Id, userId, receiverId);

    navigate("/chat", {
      state: {
        Room_Id: roomId,
        Service_Id: service?.Service_Id,
        Sender_Id: userId,
        Receiver_Id: receiverId,
        Tech_Id: receiverId,
        Users_Id: userId,
        otherUserName: `${
          receiverData?.First_Name ?? service?.First_Name
        } ${receiverData?.Last_Name ?? service?.Last_Name}`,
        message: "สนใจงานบริการนี้ครับ",
      },
    });
  }


// console.log(service?.Service_Id);

useEffect(() => {
const fetchReview = async()=>{
  try{
      const response = await axios.get(`http://localhost:3000/api/readreviewbyservice/${service?.Service_Id}`)
      console.log(response.data.result);
      setReview(response.data.result);
  }catch(err){
    console.log("Error to fetch review:", err);
  }


}  
fetchReview();
}, []);


  const firstName = receiverData?.First_Name ?? service?.First_Name ?? "";
  const lastName = receiverData?.Last_Name ?? service?.Last_Name ?? "";
  const avatar = receiverData?.Avatar ?? service?.Avatar;

function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('th-TH', options);
}

function formatTime(date) {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(date).toLocaleTimeString('th-TH', options);
}

  return (
    <section className="service-page">
      <div className="service-card">
        <div className="service-image-wrap">
          <img
            className="imgservice"
            src={`http://localhost:3000/uploads/${service?.Image}`}
            alt={service?.Title || "รูปภาพบริการ"}
          />
        </div>

        <div className="service-content">
          <div className="service-heading">
            <div>
              <span className="service-label">บริการช่าง</span>
              <h1 className="service-title">{service?.Title}</h1>
            </div>
            <div className="service-price">
              <span>เริ่มต้น</span>
              <strong>{service?.Price?.toLocaleString() || "ไม่ระบุ"} บาท</strong>
            </div>
          </div>

          <div className="service-info">
            <div className="info-block">
              <h2>รายละเอียดบริการ</h2>
              <p>{service?.Description || "ไม่มีรายละเอียดบริการ"}</p>
            </div>

            <div className="info-row">
              <div className="info-item">
                <span className="info-title">ประเภทงาน</span>
                <span className="category-badge">{service?.Category || "-"}</span>
              </div>

              <div className="info-item">
                <span className="info-title">รหัสผู้ให้บริการ</span>
                <span>{service?.Users_Id || "-"}</span>
              </div>
            </div>

            <div className="area-section">
              <h2>พื้นที่ให้บริการ</h2>

              {area.length > 0 ? (
                <div className="area">
                  {area.map((item) => (
                    <span className="province" key={item.Area_Id}>
                      {item.Province}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-area">ยังไม่มีพื้นที่ให้บริการ</p>
              )}
            </div>
          </div>

          <div className="provider">
            <div className="provider-profile">
              <div className="imageUser">
                {avatar ? (
                  <img
                    className="imguser"
                    src={`http://localhost:3000/uploads/${avatar}`}
                    alt={`${firstName} ${lastName}`}
                  />
                ) : (
                  <span className="avatar-placeholder">
                    {firstName.charAt(0) || "?"}
                  </span>
                )}
              </div>

              <div className="provider-detail">
                <span className="provider-label">ผู้รับงาน</span>
                <strong className="techName">
                  {firstName} {lastName}
                </strong>
              </div>
            </div>

            {token && (
              <button className="buttonMessage" onClick={handleChatClick}>
                ติดต่อผู้รับงาน
              </button>
            )}
          </div>
          <div>
            <p>รีวิว</p>
           { review.length === 0 ? (
            <p>ยังไม่มีรีวิว</p>
           ) : (
            review.map((item) => (
              <div className="review" key={item.Review_Id}>
                <span>{item.Comment}</span>
                <span>{item.Rating}คะแนน </span>
                <span>วันที่ {formatDate(item.Created_At)} เวลา {formatTime(item.Created_At)}</span>
              </div>
            ))
           )}

          </div>
        </div>
      </div>
    </section>
  );
}
