import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

const profileSchema = object().shape({
  firstName: string().required("กรุณากรอกชื่อจริง"),
  lastName: string().required("กรุณากรอกนามสกุล"),
  phone: string()
    .min(10 ,"กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 ตัวอักษร")
    .max(10,"กรุณากรอกเบอร์โทรศัพท์ไม่เกิน 10 ตัวอักษร")
  .required("กรุณากรอกเบอร์โทรศัพท์"),
  address: string().required("กรุณากรอกที่อยู่"),
  gender: string().required("กรุณาเลือกเพศ"),
  birthday: string().required("กรุณาเลือกวันเกิด"),
});


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
const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // --- ฟังก์ชันเลือกไฟล์ภาพจากอุปกรณ์ ---
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0])
  }
// --- ฟังก์ชันสร้างโปรไฟล์ใหม่เมื่อผู้ใช้กดบันทึก ---
  const handleCreateProfile = async () => {
  setErrors({});


    try {
    await profileSchema.validate(
      {
        firstName,
        lastName,
        phone,
        address,
        gender,
        birthday,
      },
      { abortEarly: false } // เก็บ Error ของทุกช่อง
    );
  } catch (validationError) {
    if (validationError.name === "ValidationError") {
      const formattedErrors = {};
      validationError.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
    }
    return; // หยุดการทำงาน ไม่ส่งคำขอไปยัง API
  }
  // 2. ดำเนินการต่อเมื่อข้อมูลถูกต้องตามเงื่อนไข
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    alert("กรุณาสร้างบัญชีใหม่อีกครั้ง");
    navigate("/register");
    return;
  }
  const userObj = JSON.parse(userStr);
  const id = userObj?.payload?.id;




    try {
      // ขั้นตอนที่ 1 — สร้าง Profile
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

      //  ขั้นตอนที่ 2 — อัปโหลดรูป
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
        <div>
          <input 
            className={errors.firstName ? "i1 error" : "i1"} 
            type="text" 
            placeholder="ชื่อ" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
          {errors.firstName && <p className="err-msg">{errors.firstName}</p>}
        </div>
        <div>
          <input 
            className={errors.lastName ? "i1 error" : "i1"} 
            type="text" 
            placeholder="นามสกุล" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
          {errors.lastName && <p className="err-msg">{errors.lastName}</p>}
        </div>
      </div>

      <div className="rownw">
        <div>
          <input 
            className={errors.phone ? "i1 error" : "i1"} 
            type="text" 
            placeholder="เบอร์โทรศัพท์" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
          {errors.phone && <p className="err-msg">{errors.phone}</p>}
        </div>
        <div>
          <input 
            className={errors.address ? "i1 error" : "i1"} 
            type="text" 
            placeholder="ที่อยู่" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
          />
          {errors.address && <p className="err-msg">{errors.address}</p>}
        </div>
      </div>

      <div className="row">
        <div>
          <select 
            className={errors.gender ? "i1 error" : "i1"} 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">เพศ</option>
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          {errors.gender && <p className="err-msg">{errors.gender}</p>}
        </div>
        <div>
          <input 
            className={errors.birthday ? "i1 error" : "i1"} 
            type="date" 
            value={birthday} 
            onChange={(e) => setBirthday(e.target.value)} 
          />
          {errors.birthday && <p className="err-msg">{errors.birthday}</p>}
        </div>
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