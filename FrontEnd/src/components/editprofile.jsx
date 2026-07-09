import { useEffect, useState } from "react";
import axios from "axios";

export default function Editprofile({ profile, onProfileUpdated }) {
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

  // --- ดึง ID ของผู้ใช้จาก localStorage เพื่อแนบไปกับคำขออัปเดต ---
  const data = JSON.parse(localStorage.getItem("user"));
  const myId = data?.payload?.id;

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
      if (!firstName || !lastName || !phone || !address) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

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

        const respons= await axios.patch("http://localhost:3000/api/updateprofile", formData, {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("บันทึกสำเร็จ!");
      onProfileUpdated?.(respons.data.result); // เรียก callback เพื่อแจ้งให้ component แม่ทราบว่ามีการอัปเดต
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.msg);
    }finally {
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
      <p className="f1">ข้อมูลส่วนตัว</p>

      {/* --- กล่องฟอร์มสำหรับกรอกข้อมูลผู้ใช้ --- */}
      <div>
        <div className="row">
          <input
            className="i1"
            type="text"
            placeholder="ชื่อ"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="i1"
            type="text"
            placeholder="นามสกุล"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="rownw">
          <input
            className="i1"
            type="text"
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <input
            className="i1"
            type="text"
            placeholder="ที่อยู่"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="row">
          <select
            className="i1"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          <input
            className="i1"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
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