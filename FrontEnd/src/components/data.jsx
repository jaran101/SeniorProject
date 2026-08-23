import { useState ,useMemo } from "react";
import Newprofile from "./newprofile";
import Editprofile from "./editprofile";
import { memo } from "react";
  

export default memo(function Data({ profile , onProfileUpdated }) {
  // --- State สำหรับควบคุมการแสดงฟอร์มแก้ไขข้อมูล ---
  const [show, setShow] = useState(false);

  // --- ดึงข้อมูลผู้ใช้จาก localStorage เพื่อใช้แสดง ID ของผู้ใช้ ---
 const [myId] = useState(() => {
  const user = localStorage.getItem("user") ?? null;
  if (!user) return null;
  const parsedUser = JSON.parse(user);
  const userId = parsedUser?.payload?.id;
  return userId;
});


  // --- ฟังก์ชันแปลงค่าเพศให้เป็นข้อความที่อ่านง่าย ---
  const formatGender = (gender) => {
    if (gender === "MALE") return "ชาย";
    if (gender === "FEMALE") return "หญิง";
    if (gender === "OTHER") return "อื่นๆ";
    return "-";
  };

  // --- ถ้าไม่มีข้อมูล profile ให้แสดงหน้าให้สร้างโปรไฟล์ใหม่ ---
  if (!profile) {
    return (
      <div className="data-container">
        <p>ยังไม่มีข้อมูล Profile</p>
        <Newprofile />
      </div>
    );
  }


  
  //-----------------------------------------------------
  //UI
    //-----------------------------------------------------

  return (
    <div>
<div
    className="data-container" style={{ width: show === true ? "1200px" : "400px" }}
>       <div className="data">
         <p>Id: {myId}</p>
        <p>
          ชื่อ: {profile.First_Name} {profile.Last_Name}
        </p>
        <p>เบอร์โทรศัพท์: {profile.Phone}</p>
        <p>เพศ: {formatGender(profile.Gender)}</p>
        <p>วันเกิด: {profile.Birth_Date? profile.Birth_Date.slice(0, 10):"-"}</p>
        <p>ที่อยู่: {profile.Address}</p>
       </div>

        <div>
          <button className="bdata" onClick={() => setShow(!show)}>
            {show ? "X" : "แก้ไข"}
          </button>
          {show && (<Editprofile
              profile={profile}
              myId={myId}
              onProfileUpdated={(updated) => {
            onProfileUpdated?.(updated);
                setShow(false); 
            }}
            />)}
        </div>
      </div>
    </div>
  );
});