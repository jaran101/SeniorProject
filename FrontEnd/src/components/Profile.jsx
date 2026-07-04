import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Calendar from "./Calendar";
import Data from "./data";
import Newprofile from "./newprofile";
import SearchMyservice from "./searchmyservice";
import Tau from "./tau";
import "./Profile.css";

export default function Profile() {
//Ustate---------------------------------------------------------------------------------
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("calendar");
  const [animate, setAnimate] = useState(false);
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);
  const navigate = useNavigate();

// เปลี่ยนหน้าที่จะแสดงในส่วนเนื้อหาเมื่อกดเมนูต่าง ๆ
  const changePage = (newPage) => {
    if (newPage === page) return;

    setAnimate(false);
    setTimeout(() => {
      setPage(newPage);
      setAnimate(true);
    }, 50);
  };

  // โหลดข้อมูลผู้ใช้และข้อมูลโปรไฟล์เมื่อ component ถูกแสดงครั้งแรก
  useEffect(() => {
    const data = localStorage.getItem("user");
    const id = JSON.parse(data).payload.id;

    setAnimate(true);

    if (data) {
      setUser(JSON.parse(data));
    }

// ดึงข้อมูลโปรไฟล์จาก API หากยังไม่มีข้อมูลจะตั้งค่าสถานะให้แสดงหน้าสร้างโปรไฟล์
    const loadProfile = async () => {
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
          alert("เกิดข้อผิดพลาด: " + error.response?.data?.msg);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    loadProfile();
  }, []);

// ถ้ายังไม่มีข้อมูลโปรไฟล์ ให้แสดงหน้าแบบสร้างโปรไฟล์แทน
  if (!hasProfile) {
    return (
      <div className="data-container">
        <p>ยังไม่มีข้อมูล Profile</p>
        <Newprofile />
      </div>
    );
  }

// ถ้ายังไม่ได้เข้าสู่ระบบ ให้แสดงข้อความเตือนก่อน
  if (!user) {
    return <p className="not-login">กรุณา login ก่อน</p>;
  }
//Ui--------------------------------------------------------------------------------
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

      {/* แสดงเมนูสำหรับสลับหน้าเนื้อหาต่าง ๆ */}
      <div className="profile-menu">
        <button onClick={() => changePage("searchmyservice")} className="profile-button">
          งานของฉัน
        </button>
        <button onClick={() => changePage("calendar")} className="profile-button">
          ปฏิทินงาน
        </button>
        <button onClick={() => changePage("Tau")} className="profile-button">
          กำหนดการ
        </button>
        <button onClick={() => changePage("data")} className="profile-button">
          ข้อมูลส่วนตัว
        </button>
      </div>

      {/* แสดง component ที่เลือกตามหน้าในเมนู */}
      <div key={page} className={animate ? "page-animation active" : "page-animation"}>
        {page === "calendar" && <Calendar />}
        {page === "data" && <Data profile={profile} />}
        {page === "Tau" && <Tau />}
        {page === "searchmyservice" && <SearchMyservice />}
      </div>
    </div>
  );
}