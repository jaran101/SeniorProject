import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Newprofile() {
  // --- State สำหรับเก็บข้อมูลฟอร์มข้อมูลส่วนตัว ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  // --- State สำหรับเก็บไฟล์ภาพที่เลือกไว้ก่อนอัปโหลด ---
  const [avatar, setAvatar] = useState(null); 
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // --- ฟังก์ชันเลือกไฟล์ภาพจากอุปกรณ์ ---
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0])
  }
// --- ฟังก์ชันสร้างโปรไฟล์ใหม่เมื่อผู้ใช้กดบันทึก ---
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
        { headers: { authorization: token } }
      );

      // ✅ ขั้นตอนที่ 2 — อัปโหลดรูป
      if (avatar) {
        const formData = new FormData()
        formData.append("file", avatar)
        formData.append("Users_Id", id)

        await axios.post("/api/uploadprofile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
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
      {/* --- ส่วนหัวของฟอร์ม --- */}
      <p className="f1">ข้อมูลส่วนตัว</p>

      {/* --- กล่องฟอร์มกรอกข้อมูลผู้ใช้ --- */}
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

        {/* --- ตัวเลือกอัปโหลดรูปภาพ --- */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {avatar && <p>เลือกไฟล์: {avatar.name}</p>}
      </div>

      {/* --- ปุ่มบันทึกข้อมูล --- */}
      <hr className="hr1" />
      <button className="button" onClick={handleCreateProfile}>
        บันทึก
      </button>
    </div>
  );
}