
import { useEffect, useState } from "react";
import axios from "axios";
import { object, string } from "yup";
import "./editprofile.css";
import CustomerMap from "./map/CustomerMap.jsx";
import ReadMyAddresses from "./map/readmyaddresses.jsx";

const profileSchema = object().shape({
  firstName: string().trim().required("กรุณากรอกชื่อจริง"),
  lastName: string().trim().required("กรุณากรอกนามสกุล"),
  phone: string()
    .matches(/^[0-9]{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก")
    .required("กรุณากรอกเบอร์โทรศัพท์"),
  gender: string().required("กรุณาเลือกเพศ"),
  birthday: string().required("กรุณาเลือกวันเกิด"),
});

const months = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export default function Editprofile({
  profile,
  onProfileUpdated,
  myId,
  addresses,
  setAddresses,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthday, setBirthday] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [yearBE, setYearBE] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const currentYearBE = new Date().getFullYear() + 543;
  const years = Array.from(
    { length: 100 },
    (_, i) => currentYearBE - i
  );
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // โหลดข้อมูลโปรไฟล์เดิม
  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.First_Name || "");
    setLastName(profile.Last_Name || "");
    setPhone(profile.Phone || "");
    setGender(profile.Gender || "MALE");

    const birthDate = profile.Birth_Date
      ? String(profile.Birth_Date).slice(0, 10)
      : "";

    setBirthday(birthDate);

    if (birthDate) {
      const [year, monthValue, dayValue] = birthDate
        .split("-")
        .map(Number);

      setYearBE(String(year + 543));
      setMonth(String(monthValue - 1));
      setDay(String(dayValue));
    } else {
      setYearBE("");
      setMonth("");
      setDay("");
    }

    setAvatar(null);
    setErrors({});

    // ถ้าเปลี่ยนโปรไฟล์ ให้ล้าง Preview URL รูปที่เลือกใหม่
    setPreviewUrl(
      profile.Avatar
        ? `http://localhost:3000/uploads/${profile.Avatar}`
        : null
    );
  }, [profile]);

  // คืนค่า URL ของภาพที่สร้างจากไฟล์ในเครื่อง
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // เปลี่ยนวันเกิดจาก พ.ศ. เป็น ค.ศ.
  const handleBirthdayChange = (
    newDay,
    newMonth,
    newYearBE
  ) => {
    setDay(newDay);
    setMonth(newMonth);
    setYearBE(newYearBE);
    setErrors((prev) => ({ ...prev, birthday: undefined }));

    if (!newDay || newMonth === "" || !newYearBE) {
      setBirthday("");
      return;
    }

    const yearCE = Number(newYearBE) - 543;
    const monthIndex = Number(newMonth);
    const dayNumber = Number(newDay);

    const date = new Date(yearCE, monthIndex, dayNumber);

    // ป้องกันวันที่ไม่มีอยู่จริง เช่น 31 กุมภาพันธ์
    if (
      date.getFullYear() !== yearCE ||
      date.getMonth() !== monthIndex ||
      date.getDate() !== dayNumber
    ) {
      setBirthday("");
      setErrors((prev) => ({
        ...prev,
        birthday: "วันที่เลือกไม่ถูกต้อง",
      }));
      return;
    }

    const yyyy = String(yearCE).padStart(4, "0");
    const mm = String(monthIndex + 1).padStart(2, "0");
    const dd = String(dayNumber).padStart(2, "0");

    setBirthday(`${yyyy}-${mm}-${dd}`);
  };

  // เปลี่ยนค่าในฟอร์มและล้าง Error ของช่องนั้น
  const updateField = (setter, field, value) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // บันทึกข้อมูลโปรไฟล์
  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    setErrors({});

    try {
      await profileSchema.validate(
        { firstName, lastName, phone, gender, birthday },
        { abortEarly: false }
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
      return;
    }

    try {
      const formData = new FormData();

      formData.append("Users_Id", myId);
      formData.append("First_Name", firstName.trim());
      formData.append("Last_Name", lastName.trim());
      formData.append("Phone", phone);
      formData.append("Gender", gender);
      formData.append("Birth_Date", birthday);

      if (avatar) {
        formData.append("file", avatar);
      }

      const response = await axios.patch(
        "http://localhost:3000/api/updateprofile",
        formData,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      alert("บันทึกสำเร็จ!");
      onProfileUpdated?.(response.data.result);
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);

      alert(
        "เกิดข้อผิดพลาด: " +
          (error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้")
      );
    } finally {
      setSaving(false);
    }
  };

  // เลือกรูปโปรไฟล์
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ");
      event.target.value = "";
      return;
    }

    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="Edit">
      <div className="edit-heading">
        <h2>แก้ไขข้อมูลส่วนตัว</h2>
        <p>จัดการข้อมูลส่วนตัวและที่อยู่ของคุณ</p>
      </div>

      <hr className="Line" />

      <section className="EditContainer">
        {/* ข้อมูลส่วนตัว */}
        <div className="Editdata">
          <div className="edit-section-title">
            <h3>ข้อมูลส่วนตัว</h3>
            <p>กรอกข้อมูลให้ครบถ้วนก่อนบันทึก</p>
          </div>

          <div className="rowEdit">
            <div className="form-field">
              <label htmlFor="firstName">ชื่อ</label>
              <input
                id="firstName"
                className="input_profile"
                type="text"
                placeholder="กรอกชื่อจริง"
                value={firstName}
                onChange={(e) =>
                  updateField(setFirstName, "firstName", e.target.value)
                }
              />
              {errors.firstName && (
                <p className="err-msg">{errors.firstName}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName">นามสกุล</label>
              <input
                id="lastName"
                className="input_profile"
                type="text"
                placeholder="กรอกนามสกุล"
                value={lastName}
                onChange={(e) =>
                  updateField(setLastName, "lastName", e.target.value)
                }
              />
              {errors.lastName && (
                <p className="err-msg">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="rowEdit">
            <div className="form-field">
              <label htmlFor="phone">เบอร์โทรศัพท์</label>
              <input
                id="phone"
                className="input_profile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
                value={phone}
                onChange={(e) =>
                  updateField(
                    setPhone,
                    "phone",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
              />
              {errors.phone && (
                <p className="err-msg">{errors.phone}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="gender">เพศ</label>
              <select
                id="gender"
                className="input_profile"
                value={gender}
                onChange={(e) =>
                  updateField(setGender, "gender", e.target.value)
                }
              >
                <option value="MALE">ชาย</option>
                <option value="FEMALE">หญิง</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
              {errors.gender && (
                <p className="err-msg">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="form-field birthday-field">
            <label>วันเกิด</label>

            <div className="rowEdit2">
              <select
                aria-label="ปีเกิด พ.ศ."
                value={yearBE}
                onChange={(e) =>
                  handleBirthdayChange(day, month, e.target.value)
                }
              >
                <option value="">ปี พ.ศ.</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                aria-label="เดือนเกิด"
                value={month}
                onChange={(e) =>
                  handleBirthdayChange(day, e.target.value, yearBE)
                }
              >
                <option value="">เดือน</option>
                {months.map((name, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                aria-label="วันที่เกิด"
                value={day}
                onChange={(e) =>
                  handleBirthdayChange(e.target.value, month, yearBE)
                }
              >
                <option value="">วันที่</option>
                {days.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {errors.birthday && (
              <p className="err-msg">{errors.birthday}</p>
            )}
          </div>

          <button
            type="button"
            className="buttonEdit"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>

        {/* รูปโปรไฟล์ */}
        <aside className="avatar-section">
          <h3>รูปโปรไฟล์</h3>
          <p className="avatar-description">
            เลือกรูปภาพเพื่อใช้เป็นรูปโปรไฟล์ของคุณ
          </p>

          <div className="avatar-preview-container">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="ตัวอย่างรูปโปรไฟล์"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">
                ยังไม่มีรูปโปรไฟล์
              </div>
            )}
          </div>

          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="avatar-input"
          />

          <label htmlFor="avatarInput" className="upload-btn">
            เลือกรูปภาพ
          </label>

          {avatar && (
            <p className="avatar-filename">{avatar.name}</p>
          )}
        </aside>
      </section>

      {/* จัดการที่อยู่ */}
      <section className="address-section">
        <div className="edit-section-title">
          <h3>จัดการที่อยู่</h3>
          <p>ตรวจสอบหรือเพิ่มที่อยู่สำหรับใช้บริการช่าง</p>
        </div>

     <div className="address-table-container">
        <ReadMyAddresses
            myId={myId}
            addresses={addresses}
            setAddresses={setAddresses}
        />
    </div>

        <button
          type="button"
          className="buttonAddAddress"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "ยกเลิก" : "+ เพิ่มที่อยู่"}
        </button>

        {show && (
          <div className="customer-map-container">
            <CustomerMap myId={myId} />
          </div>
        )}
      </section>

      <hr className="hr1" />
    </div>
  );
}
