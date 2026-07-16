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

    setUser(parsedUser?.payload);
    console.log(token);
    console.log("User from localStorage:", parsedUser?.payload);
    
  }, [navigate, token]);



  return (
    <div className="header">
      <div className="header-brand">
        <span className="brand-name">Fix Chang</span>
        <span className="brand-user">
        </span>
      </div>


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
            </>
          )}
        </div>
      </div>
    </div>
  );
}