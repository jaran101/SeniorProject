import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Newprofile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState(null); // ✅ เก็บไฟล์ไว้ใน state
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ แค่เก็บไฟล์ไว้ก่อน ยังไม่ส่ง
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0])
  }
//-----------------------------------------------------------------------------------------
//สร้างโปรไฟล์ใหม่
//-----------------------------------------------------------------------------------------

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !phone || !gender || !birthday || !address) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
     const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (10 หลัก ขึ้นต้นด้วย 0)"); // ✅ alert string ตรงๆ
      return;
    }
  

    const token = localStorage.getItem("token");
    const id = JSON.parse(localStorage.getItem("user")).payload.id;

    try {
      // ✅ ขั้นตอนที่ 1 — สร้าง Profile
      await axios.post("/api/newprofile",
        {
          Users_Id: id,
          First_Name: firstName,
          Last_Name: lastName,
          Phone: phone,
          Gender: gender,
          Birth_Date: birthday,
          Address: address,
        },
        { headers: { Authorization: token } }
      );

      // ✅ ขั้นตอนที่ 2 — อัปโหลดรูป
      if (avatar) {
        const formData = new FormData()
        formData.append("file", avatar)
        formData.append("Users_Id", id)

        await axios.post("/api/uploadprofile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        })
      }

      alert("สร้างโปรไฟล์สำเร็จ");
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.msg);
    }
  };
//-----------------------------------------------------------------------------------------
//UI
//-----------------------------------------------------------------------------------------
  return (
    <div>
      <p className="f1">ข้อมูลส่วนตัว</p>
      <div className="">
        <div className="row">
          <input className="i1" type="text" placeholder="ชื่อ" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="i1" type="text" placeholder="นามสกุล" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="rownw">
          <input className="i1" type="text" placeholder="เบอร์โทรศัพท์" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <br />
          <input className="i1" type="text" placeholder="ที่อยู่" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="row">
          <select className="i1" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">เพศ</option>
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          <input className="i1" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        </div>

        {/* ✅ เลือกรูปภาพ */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {avatar && <p>เลือกไฟล์: {avatar.name}</p>}
      </div>

      <hr className="hr1" />
      <button className="button" onClick={handleCreateProfile}>
        บันทึก
      </button>
    </div>
  );
}