import { useEffect, useState } from "react";
import axios from "axios";
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


export default function Editprofile({ profile, onProfileUpdated ,myId
 }) {
  // --- State สำหรับเก็บข้อมูลฟอร์มที่ผู้ใช้แก้ไข ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // --- โหลดข้อมูลโปรไฟล์เดิมเข้าฟอร์มตอน component ถูก render ครั้งแรก ---
  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.First_Name || "");
    setLastName(profile.Last_Name || "");
    setPhone(profile.Phone || "");
    setAddress(profile.Address || "");
    setGender(profile.Gender || "MALE");
    setBirthday(profile.Birth_Date ? profile.Birth_Date.slice(0, 10) : "");

    if (profile.Avatar) {
      setPreviewUrl(`http://localhost:3000/uploads/${profile.Avatar}`);
    }
  }, [profile]);

  // --- ฟังก์ชันบันทึกข้อมูลเมื่อผู้ใช้กดปุ่มบันทึก ---
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
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
      setSaving(false);
      return; // หยุดการทำงาน ไม่ส่งคำขอไปยัง API
    }

    try {
      const formData = new FormData();
      formData.append("Users_Id", myId);
      formData.append("First_Name", firstName);
      formData.append("Last_Name", lastName);
      formData.append("Phone", phone);
      formData.append("Address", address);
      formData.append("Gender", gender);
      formData.append("Birth_Date", birthday);

      if (avatar) {
        formData.append("file", avatar);
      }

      const respons = await axios.patch("http://localhost:3000/api/updateprofile", formData, {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("บันทึกสำเร็จ!");
      onProfileUpdated?.(respons.data.result); // เรียก callback เพื่อแจ้งให้ component แม่ทราบว่ามีการอัปเดต
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      console.log("testError", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  // --- ฟังก์ชันเลือกภาพและแสดงตัวอย่างก่อนอัปโหลด ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    if(previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      {/* --- ส่วนหัวของฟอร์มแสดงข้อความข้อมูลส่วนตัว --- */}
      <hr className="Line" />
      <p className="f1">ข้อมูลส่วนตัว {myId}</p>

      {/* --- กล่องฟอร์มสำหรับกรอกข้อมูลผู้ใช้ --- */}
      <div>
        <div className="row">
          <div>
            <input
            className="i1"
            type="text"
            placeholder="ชื่อ"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="err-msg">{errors.firstName}</p>}
          </div>
          <div>
            <input
            className="i1"
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
            className="i1"
            type="text"
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="err-msg">{errors.phone}</p>}
          </div>
          <div>
          <input
            className="i1"
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
            className="i1"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          </div>
          <div>
          <input
            className="i1"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          {errors.gender && <p className="err-msg">{errors.gender}</p>}
          {errors.birthday && <p className="err-msg">{errors.birthday}</p>}
          </div>
        </div>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="ภาพที่เลือก"
            style={{ maxWidth: "100%", marginTop: "8px" }}
          />
        )}
      </div>

      {/* --- ปุ่มบันทึกข้อมูล --- */}
      <hr className="hr1" />
      <button className="button" onClick={handleSave}>
        บันทึก
      </button>
    </div>
  );
}