import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Editprofile() {
const [loading, setLoading] = useState(true); // ✅ เช็คสถานะโหลด
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  const data = JSON.parse(localStorage.getItem("user"));
  const myid = data.payload.id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/readprofile/${myid}`, {
          headers: { authorization: localStorage.getItem("token") },
        });
        const p = response.data;

        // ✅ โหลดข้อมูลเดิมเข้า input
        setFirstName(p.First_Name || "");
        setLastName(p.Last_Name || "");
        setPhone(p.Phone || "");
        setAddress(p.Address || "");
        setGender(p.Gender || "MALE");
        setBirthday(p.Birth_Date ? p.Birth_Date.slice(0, 10) : "");
        if (p.Avatar) {
          setPreviewUrl(`http://localhost:3000/uploads/${p.Avatar}`);
        }

      } catch (error) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", error);
      } finally {
        setLoading(false); // ✅ โหลดเสร็จแล้วไม่ว่าจะสำเร็จหรือไม่
      }
    };
    loadProfile();
  }, []);

  // ✅ ฟังก์ชันบันทึก
  const handleSave = async () => {
    try {

      if (!firstName || !lastName || !phone || !address) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const formData = new FormData()
        formData.append("Users_Id", myid)
        formData.append("First_Name", firstName)
        formData.append("Last_Name", lastName)
        formData.append("Phone", phone)
        formData.append("Address", address)
        formData.append("Gender", gender)
        formData.append("Birth_Date", birthday)
        if (avatar) {
            formData.append("file", avatar) // ← ส่งไฟล์จริง
        }
      await axios.patch(`http://localhost:3000/api/updateprofile`,formData,{  
        headers: { authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data" 
        },
      });
      alert("บันทึกสำเร็จ!");
      window.location.reload(); // ✅ โหลดหน้าใหม่
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      console.log("error:", error.response?.data)
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.msg);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (loading) return <p>กำลังโหลด...</p>; // ✅ รอโหลดก่อน render

  return (
    <div>
      <p className="f1">ข้อมูลส่วนตัว</p>
      <div>
        <div className="row">
          <input className="i1" type="text" placeholder="ชื่อ"
            value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="i1" type="text" placeholder="นามสกุล"
            value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="rownw">
          <input className="i1" type="text" placeholder="เบอร์โทรศัพท์"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
          <br />
          <input className="i1" type="text" placeholder="ที่อยู่"
            value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="row">
          <select className="i1" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          <input className="i1" type="date"
            value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
        <img src={previewUrl} alt="ภาพที่เลือก" style={{ maxWidth: "100%", marginTop: "8px" }}  />
      )}
      </div>
      <hr className="hr1" />
      <button className="button" onClick={handleSave}> {/* ✅ เพิ่ม onClick */}
        บันทึก
      </button>
    </div>
  );
}