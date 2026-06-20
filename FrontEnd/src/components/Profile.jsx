import { useEffect, useState } from "react";
import "./Profile.css";
import Calendar from "./Calendar";
import Data from "./data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Newprofile from "./newprofile";
import ServiceCreate from "./servicecreate";
import SearchMyservice from "./searchmyservice";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("calendar");
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();


const changePage = (newPage) => {
  if (newPage === page) return; // ถ้ากดปุ่มเดิม ไม่ต้องทำอะไร 
  setAnimate(false);
  setTimeout(() => {
    setPage(newPage);
    setAnimate(true);
  }, 50);
};
  // โหลด user จาก localStorage
    
    const [profile, setProfile] = useState(null);
    const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    
    const data = localStorage.getItem("user");
    const id = JSON.parse(data).payload.id;
    const email = JSON.parse(data).payload.email;      
    setAnimate(true);
    if (data) {
      setUser(JSON.parse(data));
    }
    const loadProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/readprofile/${id}`, {
          headers: { authorization: localStorage.getItem("token") },
        });
        setProfile(response.data); // ✅ เก็บใน state เดียวพอ
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false); // ✅ ยังไม่มี profile
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

  if (!hasProfile) {
    return (
      <div className="data-container">
        
        <p>ยังไม่มีข้อมูล Profile</p>
        <Newprofile />
      </div>
    );
  }





if (!user) return <p className="not-login">กรุณา login ก่อน</p>;

  return (
    <div>
      
      <div className="profile-container"> 
      <div className="profile-image">
  {profile?.Avatar
        ? <img src={`http://localhost:3000/uploads/${profile.Avatar}`} alt="avatar" width={120} />
        : <p>ยังไม่มีรูปโปรไฟล์</p>
      }      </div>
      <div className="profile-box">
        
      <p> ชื่อ:{profile?.First_Name} {profile?.Last_Name}</p>
        <p> โทร:{profile?.Phone}</p>
      </div> 
    </div>

    <div className="profile-menu">
      <button onClick={()=>changePage("searchmyservice")}  className="profile-button">งานของฉัน</button>
      <button onClick={()=>changePage("calendar")} className="profile-button">ปฏิทินงาน</button>
      <button  className="profile-button">งานที่ต้องส่ง</button>
      <button onClick={()=>changePage("data")} className="profile-button">ข้อมูลส่วนตัว</button>

    </div>
   <div key={page} className={animate ? "page-animation active" : "page-animation"}>
     {page === "calendar" && <Calendar />}
     {page === "data" && <Data  profile={profile} />}
     {page === "searchmyservice" && <SearchMyservice />}
   </div>
    </div>
  );
}