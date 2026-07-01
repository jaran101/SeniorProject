import { useState } from "react";
import Newprofile from "./newprofile";
import Editprofile from "./editprofile";

export default function Data({ profile }) {
  const [show, setShow] = useState(false);
  const data = JSON.parse(localStorage.getItem("user"));
  const myid = data.payload.id;
  

  const formatGender = (gender) => {
    if (gender === "MALE") return "ชาย";
    if (gender === "FEMALE") return "หญิง";
    if (gender === "OTHER") return "อื่นๆ";
    return "-";
  };
console.log(profile)
  // ยังไม่มี profile
  if (!profile) {
    return (
      <div className="data-container">
        <p>ยังไม่มีข้อมูล Profile</p>
        <Newprofile />
      </div>
    );
  }

  return (
    <div>
      <div className="data-container">
        <p>Id: {myid}</p>
        <p>ชื่อ: {profile.First_Name} {profile.Last_Name}</p>
        <p>เบอร์โทรศัพท์: {profile.Phone}</p>
        <p>เพศ: {formatGender(profile.Gender)}</p>
        <p>วันเกิด: {profile.Birth_Date.slice(0, 10)}</p>
        <p>ที่อยู่: {profile.Address}</p>
        <div>
          <button className="bdata" onClick={() => setShow(!show)}>
            {show ? "X" : "แก้ไข"}
          </button>
          {show && <Editprofile  profile={profile} />}
        </div>
      </div>
    </div>
  );
}