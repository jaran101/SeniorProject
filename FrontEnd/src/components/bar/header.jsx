import Logout from "../Logout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // เก็บข้อมูลผู้ใช้และโปรไฟล์ที่โหลดจาก API
  const [user, setUser] = useState(null);

  // ตรวจสถานะหน้าเพื่อแสดงเมนูให้เหมาะสม
  const isProfilePage = location.pathname === "/profile";
  const isChatPage = location.pathname === "/chat";
  const isHomePage = location.pathname === "/";

  // Token ที่เก็บไว้ใน browser เพื่อใช้เรียก API
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser?.payload);
 
    
  }, [navigate, token]);



  return (
    <div className="header">
      <div className="header-brand">
        <span className="brand-name">Fix Chang</span>
        {token?(
        <span className="brand-user">สวัสดี
        </span>
        ):(
          <span className="brand-user">ยังไม่มีข้อมูล
          </span>
        )}
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
              {token && !isProfilePage && (
                <li className="p1">
                  <a href="/profile">Profile</a>
                </li>
              )}
            </>
          )}
          {user && !isChatPage && (
            <li className="p1">
              <a href="/chat">Chat</a>
            </li>
          )}

          
          <li className="buttonLogout">
            <Logout />
          </li>
        </div>
      </div>
    </div>
  );
}