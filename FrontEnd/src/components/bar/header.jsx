import Logout from "../Logout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // เก็บข้อมูลผู้ใช้และโปรไฟล์ที่โหลดจาก API
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // ตรวจสถานะหน้าเพื่อแสดงเมนูให้เหมาะสม
  const isProfilePage = location.pathname === "/profile";
  const isHomePage = location.pathname === "/";

  // Token ที่เก็บไว้ใน browser เพื่อใช้เรียก API
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser?.payload?.id;

    setUser(parsedUser?.payload);

    const loadProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readprofile/${userId}`,
          {
            headers: { authorization: token },
          }
        );
        setProfile(response.data.result);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.log("เกิดข้อผิดพลาด:", error.response?.data.message);
          localStorage.removeItem("id");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/lar");
        }
      }
    };

    loadProfile();
  }, [navigate, token]);



  return (
    <div className="header">
      {/* ส่วนหัวของ header แสดงชื่อแอปและชื่อผู้ใช้ที่โหลดจาก profile */}
      <div className="header-brand">
        <span className="brand-name">Fix Chang</span>
        <span className="brand-user">
          {profile ? `${profile.First_Name} ${profile.Last_Name}` : "ยังไม่ได้ login"}
        </span>
      </div>

      {/* ส่วนแสดงสถานะ token เพื่อช่วยตรวจสอบว่าเข้าสู่ระบบหรือยัง */}

      {/* เมนูหลักสำหรับนำทาง */}
      <div className="menu">
        <button className="menu-btn">Menu</button>
        <div className="dropdown">
          {!isHomePage && (
            <li className="p1">
              <a href="/">Home</a>
            </li>
          )}
          {!user && (
            <li className="p1">
              <a href="/lar">Login</a>
            </li>
          )}
          {user && (
            <>
              <li className="buttonLogout">
                <Logout />
              </li>
              {token && !isProfilePage && (
                <li className="p1">
                  <a href="/profile">Profile</a>
                </li>
              )}
              <li className="p1">
                <a href="/chatpage">Chat</a>
              </li>
            </>
          )}
        </div>
      </div>
    </div>
  );
}