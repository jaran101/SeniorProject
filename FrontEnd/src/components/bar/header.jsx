import Logout from "../Logout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import isTokenExpired from "../../utils/isTokenExpired";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // เก็บข้อมูลผู้ใช้และโปรไฟล์ที่โหลดจาก API
  const [user, setUser] = useState(null);
  const {profileUser,loading} = useUser();
  // ตรวจสถานะหน้าเพื่อแสดงเมนูให้เหมาะสม
  const isProfilePage = location.pathname === "/profile";
  const isChatPage = location.pathname === "/chat";
  const isHomePage = location.pathname === "/";

  // Token ที่เก็บไว้ใน browser เพื่อใช้เรียก API
  const token = localStorage.getItem("token");

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  // TODO 1: ถ้ามี storedToken และหมดอายุ ให้ลบ user กับ token ออกจาก localStorage
  // แล้วออกจาก effect (return) เพื่อไม่ให้ไป setUser ต่อ
  if (storedToken && isTokenExpired(storedToken)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return;
  }


  if (!storedUser) return;
  setUser(JSON.parse(storedUser)?.payload);
}, [navigate, token]);



  return (
    <div className="header">
      <div className="header-brand">
        <span className="brand-name">Fix Chang</span>
        {loading ? ( 
          <span className="brand-user">กำลังโหลด...</span>
              ) : profileUser ? (
          <span className="brand-user">: {profileUser.First_Name} {profileUser.Last_Name}</span>
              ) : (
          <span className="brand-user">ยังไม่ได้ลงทะเบียนเข้าใช้งาน</span>
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
              {user && !isProfilePage && (
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

          
          {user && <li className="buttonLogout">
            <Logout />
          </li>}
        </div>
      </div>
    </div>
  );
}