
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Menu,
  X,
  House,
  UserRound,
  MessageCircle,
  ClipboardList,
  Search,
  BriefcaseBusiness,
  ChevronsRight,
  ChevronsLeft,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Logout from "../Logout";
import useUser from "../hooks/useUser";
import isTokenExpired from "../../utils/isTokenExpired";

import "./sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const user = localStorage.getItem("user");

  const { profileUser, loading } = useUser();

  // ตรวจสอบ Token
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLogin(false);
        return;
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLogin(false);
        return;
      }

      setIsLogin(true);
    };

    checkToken();
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // รายการเมนู
  const menuItems = [
    {
      name: "หน้าหลัก",
      path: "/",
      icon: House,
    },
    {
      name: "บัญชีของฉัน",
      path: "/profile",
      icon: UserRound,
    },
    {
      name: "ข้อความ",
      path: "/chat",
      icon: MessageCircle,
    },

    {
      name: "จัดการบริการ",
      path: "/listservice",
      icon: BriefcaseBusiness,
    },


    {
      name: "ผู้ดูแลระบบ",
      path: "/admin",
      icon: ShieldCheck,
    },
  ];

  return (
  <>
    {/* พื้นหลัง */}
    <div
      // className={`sidebar-overlay ${isOpen ? "show" : ""}`}
      onClick={closeSidebar}
    />

    {/* ปุ่ม Menu */}
    <button
      className={`sidebar-toggle ${isOpen ? "active" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <ChevronsLeft size={16} /> : <ChevronsRight  size={16} />}
    </button>

    {/* Sidebar */}
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      <div className="sidebar-brand">
        <h2>Fix Chang</h2>
        <p>Technician Marketplace</p>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : profileUser ? (
          <p>
            {profileUser.First_Name} {profileUser.Last_Name}
          </p>
        ) : (
          <p>ยังไม่ได้เข้าสู่ระบบ</p>
        )}
      </div>
{user &&(
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
)}

      <div className="sidebar-bottom">
        {isLogin ? (
          <Logout />
        ) : (
          <NavLink
            to="/lar"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            เข้าสู่ระบบ
          </NavLink>
        )}
      </div>
    </aside>
  </>
);
}
