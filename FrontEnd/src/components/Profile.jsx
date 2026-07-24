import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Data from "./data";
import Newprofile from "./newprofile";
import SearchMyservice from "./searchmyservice";
import OrderCalendar from "./OrderCalendar";
import Tau from "./techUser/tau";
import "./Profile.css";

export default function Profile() {
//Ustate---------------------------------------------------------------------------------
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("data");
  const [animate, setAnimate] = useState(false);
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [pendingPage, setPendingPage] = useState(null);

  const navigate = useNavigate();

// เปลี่ยนหน้าที่จะแสดงในส่วนเนื้อหาเมื่อกดเมนูต่าง ๆ
  const changePage = (newPage) => {
    if (newPage === page|| newPage === pendingPage) return;
      setPendingPage(newPage);
    setAnimate(false);
  };

  const handleTransitionEnd = () => {
  if (pendingPage) {
    setPage(pendingPage);
    setPendingPage(null);
    setAnimate(true);
  }
};

 const loadProfile = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/readprofile/${id}`, {
          headers: { authorization: localStorage.getItem("token") },
        });
        setProfile(response.data.result);
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false); 
        } else {
          console.error("เกิดข้อผิดพลาด:", error);
        alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };


  useEffect(() => {
    const data = localStorage.getItem("user");
    const id = JSON.parse(data)?.payload?.id;
    

    setAnimate(true);

      if (!data || !id) {
    return;
  }
      setUser(JSON.parse(data));
    
    loadProfile(id);
  }, []);

  if (!hasProfile) {
    return (
      <div className="data-container">
        <p>ยังไม่มีข้อมูล Profile</p>
        <Newprofile />
      </div>
    );
  }

  if (!user) {
    return <p className="not-login">กรุณา login ก่อน</p>;
  }
//------------------------------------------------------------------------------------  
//Ui----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
return (
    <div>
      {/* ส่วนแสดงข้อมูลผู้ใช้และรูปโปรไฟล์ */}
      <div className="profile-container">
        <div className="profile-image">
          {profile?.Avatar ? (
            <img
              src={`http://localhost:3000/uploads/${profile.Avatar}`}
              alt="avatar"
              width={120}
            />
          ) : (
            <p>ยังไม่มีรูปโปรไฟล์</p>
          )}
        </div>
        <div className="profile-box">
          <p>
            ชื่อ:{profile?.First_Name} {profile?.Last_Name}
          </p>
          <p>โทร:{profile?.Phone}</p>
        </div>
      </div>

      <div className="profile-menu">
        <button onClick={() => changePage("searchmyservice")} className="profile-button">
          งานของฉัน
        </button>
        <button onClick={() => changePage("data")} className="profile-button">
          ข้อมูลส่วนตัว
        </button>
        <button onClick={() => changePage("OrderCalendar")} className="profile-button">ปฎิทินธ์</button>
        <button onClick={() => changePage("tau")} className="profile-button">กำหนดการ</button>
      </div>
      {/* แสดง component ที่เลือกตามหน้าในเมนู */}
      <div  
      className={animate ? "page-animation active" : "page-animation"}
      onTransitionEnd={handleTransitionEnd}>
        {page === "data" && <Data profile={profile} onProfileUpdated={setProfile} />}
        {page === "searchmyservice" && <SearchMyservice />}
        {page === "OrderCalendar" && <OrderCalendar />}
        {page === "tau" && <Tau />}
        

      </div>
    </div>
  );
}