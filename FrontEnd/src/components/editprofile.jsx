import { useEffect, useState } from "react";
import axios from "axios";
import { object, string } from "yup";
import "./editprofile.css";

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
    const [Province, setProvince] = useState("");
  const [District, setDistrict] = useState("");

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

      // const restponseAreaEdit = await axios.patch()

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
    <div className="Edit">
      {/* --- ส่วนหัวของฟอร์มแสดงข้อความข้อมูลส่วนตัว --- */}
      <hr className="Line" />

      {/* --- กล่องฟอร์มสำหรับกรอกข้อมูลผู้ใช้ --- */}
      <div className="EditContainer">
      <div className="Editdata">

        <div className="rowEdit">
          <div>
            <input
            className="input_profile"
            type="text"
            placeholder="ชื่อ"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="err-msg">{errors.firstName}</p>}
          </div>
          <div>
            <input
            className="input_profile"
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
            className="input_profile"
            type="text"
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="err-msg">{errors.phone}</p>}
          </div>
          <div>
          <input
            className="input_profile"
            type="text"
            placeholder="ที่อยู่"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <p className="err-msg">{errors.address}</p>}
          </div>
        </div>
        <button className="buttonEdit" onClick={handleSave}>
        บันทึก
      </button>
        </div>

<div className="Editdata">
        <div className="rowEdit">
          <div>
          <select
            className="input_profile"
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
            className="input_profile"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          {errors.gender && <p className="err-msg">{errors.gender}</p>}
          {errors.birthday && <p className="err-msg">{errors.birthday}</p>}
          </div>
        </div>
        <select className="input_option"
        value={Province}
        onChange={(e) => setProvince(e.target.value)}
      >
        <option className="input_option_Province" value="">เลือกจังหวัด</option>

        <option className="input_option_Province" value="Bangkok">กรุงเทพมหานคร</option>
        <option className="input_option_Province" value="Krabi">กระบี่</option>
        <option className="input_option_Province" value="Kanchanaburi">กาญจนบุรี</option>
        <option className="input_option_Province" value="Kalasin">กาฬสินธุ์</option>
        <option className="input_option_Province" value="Kamphaeng Phet">กำแพงเพชร</option>
        <option className="input_option_Province" value="Khon Kaen">ขอนแก่น</option>
        <option className="input_option_Province" value="Chanthaburi">จันทบุรี</option>
        <option className="input_option_Province" value="Chachoengsao">ฉะเชิงเทรา</option>
        <option className="input_option_Province" value="Chon Buri">ชลบุรี</option>
        <option className="input_option_Province" value="Chai Nat">ชัยนาท</option>
        <option className="input_option_Province" value="Chaiyaphum">ชัยภูมิ</option>
        <option className="input_option_Province" value="Chumphon">ชุมพร</option>
        <option className="input_option_Province" value="Trang">ตรัง</option>
        <option className="input_option_Province" value="Trat">ตราด</option>
        <option className="input_option_Province" value="Tak">ตาก</option>
        <option className="input_option_Province" value="Nakhon Nayok">นครนายก</option>
        <option className="input_option_Province" value="Nakhon Pathom">นครปฐม</option>
        <option className="input_option_Province" value="Nakhon Phanom">นครพนม</option>
        <option className="input_option_Province" value="Nakhon Ratchasima">นครราชสีมา</option>
        <option className="input_option_Province" value="Nakhon Si Thammarat">นครศรีธรรมราช</option>
        <option className="input_option_Province" value="Nakhon Sawan">นครสวรรค์</option>
        <option className="input_option_Province" value="Nonthaburi">นนทบุรี</option>
        <option className="input_option_Province" value="Narathiwat">นราธิวาส</option>
        <option className="input_option_Province" value="Nan">น่าน</option>
        <option className="input_option_Province" value="Bueng Kan">บึงกาฬ</option>
        <option className="input_option_Province" value="Buriram">บุรีรัมย์</option>
        <option className="input_option_Province" value="Pathum Thani">ปทุมธานี</option>
        <option className="input_option_Province" value="Prachuap Khiri Khan">ประจวบคีรีขันธ์</option>
        <option className="input_option_Province" value="Prachin Buri">ปราจีนบุรี</option>
        <option className="input_option_Province" value="Pattani">ปัตตานี</option>
        <option className="input_option_Province" value="Phra Nakhon Si Ayutthaya">พระนครศรีอยุธยา</option>
        <option className="input_option_Province" value="Phayao">พะเยา</option>
        <option className="input_option_Province" value="Phang Nga">พังงา</option>
        <option className="input_option_Province" value="Phatthalung">พัทลุง</option>
        <option className="input_option_Province" value="Phichit">พิจิตร</option>
        <option className="input_option_Province" value="Phitsanulok">พิษณุโลก</option>
        <option className="input_option_Province" value="Phetchaburi">เพชรบุรี</option>
        <option className="input_option_Province" value="Phetchabun">เพชรบูรณ์</option>
        <option className="input_option_Province" value="Phrae">แพร่</option>
        <option className="input_option_Province" value="Phuket">ภูเก็ต</option>
        <option className="input_option_Province" value="Maha Sarakham">มหาสารคาม</option>
        <option className="input_option_Province" value="Mukdahan">มุกดาหาร</option>
        <option className="input_option_Province" value="Yasothon">ยโสธร</option>
        <option className="input_option_Province" value="Yala">ยะลา</option>
        <option className="input_option_Province" value="Roi Et">ร้อยเอ็ด</option>
        <option className="input_option_Province" value="Ranong">ระนอง</option>
        <option className="input_option_Province" value="Rayong">ระยอง</option>
        <option className="input_option_Province" value="Ratchaburi">ราชบุรี</option>
        <option className="input_option_Province" value="Lopburi">ลพบุรี</option>
        <option className="input_option_Province" value="Lampang">ลำปาง</option>
        <option className="input_option_Province" value="Lamphun">ลำพูน</option>
        <option className="input_option_Province" value="Sisaket">ศรีสะเกษ</option>
        <option className="input_option_Province" value="Sakon Nakhon">สกลนคร</option>
        <option className="input_option_Province" value="Songkhla">สงขลา</option>
        <option className="input_option_Province" value="Satun">สตูล</option>
        <option className="input_option_Province" value="Samut Prakan">สมุทรปราการ</option>
        <option className="input_option_Province" value="Samut Songkhram">สมุทรสงคราม</option>
        <option className="input_option_Province" value="Samut Sakhon">สมุทรสาคร</option>
        <option className="input_option_Province" value="Sa Kaeo">สระแก้ว</option>
        <option className="input_option_Province" value="Saraburi">สระบุรี</option>
        <option className="input_option_Province" value="Sing Buri">สิงห์บุรี</option>
        <option className="input_option_Province" value="Sukhothai">สุโขทัย</option>
        <option className="input_option_Province" value="Suphan Buri">สุพรรณบุรี</option>
        <option className="input_option_Province" value="Surat Thani">สุราษฎร์ธานี</option>
        <option className="input_option_Province" value="Surin">สุรินทร์</option>
        <option className="input_option_Province" value="Nong Khai">หนองคาย</option>
        <option className="input_option_Province" value="Nong Bua Lamphu">หนองบัวลำภู</option>
        <option className="input_option_Province" value="Ang Thong">อ่างทอง</option>
        <option className="input_option_Province" value="Amnat Charoen">อำนาจเจริญ</option>
        <option className="input_option_Province" value="Udon Thani">อุดรธานี</option>
        <option className="input_option_Province" value="Uthai Thani">อุทัยธานี</option>
        <option className="input_option_Province" value="Uttaradit">อุตรดิตถ์</option>
        <option className="input_option_Province" value="Ubon Ratchathani">อุบลราชธานี</option>
        <option className="input_option_Province" value="Chiang Rai">เชียงราย</option>
        <option className="input_option_Province" value="Chiang Mai">เชียงใหม่</option>
        <option className="input_option_Province" value="Phetchaburi">เพชรบุรี</option>
        <option className="input_option_Province" value="Sukhothai">สุโขทัย</option>
      </select>
        <input className="input_profile_District" type="text" 
        placeholder="อำเภอ/เขต" value={District} onChange={(e) => setDistrict(e.target.value)} />
</div>




<div>
        <input type="file" accept="image/*" onChange={handleImageChange}  />
       <div className="avatar-preview-container">
         {previewUrl && (
          <img onChange={handleImageChange}
            src={previewUrl}
            alt="ภาพที่เลือก"
            className="avatar-preview"
          />
        )}
       </div>
   
      </div>
</div>
      {/* --- ปุ่มบันทึกข้อมูล --- */}
      <hr className="hr1" />
      
    </div>
  );
}