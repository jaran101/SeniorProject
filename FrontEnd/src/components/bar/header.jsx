import Logout from "../Logout";
import { useEffect, useState } from "react";
import TokenStatus from "../TokenStatus";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const isProfilePage =location.pathname === "/profile";
  const isHomePage = location.pathname === "/";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) return; // ← ถ้าไม่มี user ให้หยุดทันที

    const parsed = JSON.parse(data);
    const id = parsed?.payload?.id; // ← ดึง id หลังเช็คแล้ว
    setUser(parsed?.payload);

    const loadProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readprofile/${id}`,
          { headers: { authorization: localStorage.getItem("token") } }
        );
        setProfile(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // ไม่มี profile ก็ไม่เป็นไร
        } else {
          console.error("เกิดข้อผิดพลาด:", error);
          localStorage.removeItem("id");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    loadProfile();
  }, []);



  return (
    <div className="header">
      <div className="header-brand">
        <span className="brand-name">Fix Chang</span>
        <span className="brand-user">
          {profile ?`${profile.First_Name} ${profile.Last_Name}` : "ยังไม่ได้ login"}

        </span>
      </div>
      <TokenStatus />
      <div className="menu">
        <button className="menu-btn">Menu</button>
        <div className="dropdown">
          {!isHomePage && <li className="p1"><a href="/">Home</a></li>}
          {!user && <li className="p1"><a href="/lar">Login</a></li>}
          {user && (
            <>
              <li className="buttonLogout"><Logout /></li>
              {token && !isProfilePage && 
              <li className="p1"><a href="/profile">Profile</a></li>}
              <li className="p1"><a href="/chatpage">Chat</a></li>
            </>
          )}
        </div>
      </div>
    </div>
  );
}