
import { useState, useMemo, memo } from "react";
import Newprofile from "./newprofile";
import Editprofile from "./editprofile";
import "./data.css";

export default memo(function Data({
  profile,
  onProfileUpdated,
  addresses = [],
  setAddresses,
}) {
  const [show, setShow] = useState(false);

  const [myId] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;

      return JSON.parse(user)?.payload?.id ?? null;
    } catch {
      return null;
    }
  });

  const formatGender = (gender) => {
    if (gender === "MALE") return "ชาย";
    if (gender === "FEMALE") return "หญิง";
    return gender || "-";
  };

  const formatThaiDate = (dateString) => {
    if (!dateString) return "-";

    const [year, month, day] = dateString.slice(0, 10)
      .split("-")
      .map(Number);

    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
      "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
      "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
    ];

    if (!year || !month || !day || month > 12) return "-";

    return `${day} ${months[month - 1]} พ.ศ. ${year + 543}`;
  };

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.Is_Default === true),
    [addresses]
  );

  const addressText = defaultAddress
    ? [
        defaultAddress.Address
          ? `บ้านเลขที่ ${defaultAddress.Address}`
          : "",
        defaultAddress.Subdistrict
          ? `ตำบล${defaultAddress.Subdistrict}`
          : "",
        defaultAddress.District
          ? `อำเภอ${defaultAddress.District}`
          : "",
        defaultAddress.Province
          ? `จังหวัด${defaultAddress.Province}`
          : "",
        defaultAddress.Postal_Code
          ? defaultAddress.Postal_Code
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "ยังไม่ได้กำหนดที่อยู่เริ่มต้น";

  if (!profile) {
    return (
      <div className="data-page">
        <div className="data-card data-empty">
          <h2>ข้อมูลส่วนตัว</h2>
          <p>ยังไม่มีข้อมูลโปรไฟล์ กรุณาสร้างโปรไฟล์ของคุณ</p>
          <Newprofile />
        </div>
      </div>
    );
  }

  if (show) {
    return (
      <div className="data-page">
        <button
          type="button"
          className="back-data-button"
          onClick={() => setShow(false)}
        >
          <span aria-hidden="true">←</span> กลับไปข้อมูลส่วนตัว
        </button>

        <Editprofile
          profile={profile}
          myId={myId}
          addresses={addresses}
          setAddresses={setAddresses}
          onProfileUpdated={(updated) => {
            onProfileUpdated?.(updated);
            setShow(false);
          }}
        />
      </div>
    );
  }

  return (
    <main className="data-page">
      <header className="data-page-heading">
        <div>
          <p className="data-eyebrow">MY ACCOUNT</p>
          <h1>ข้อมูลส่วนตัว</h1>
          <p className="data-page-description">
            จัดการข้อมูลส่วนตัวและที่อยู่สำหรับใช้บริการช่าง
          </p>
        </div>

        <button
          type="button"
          className="bdata"
          onClick={() => setShow(true)}
        >
          <span aria-hidden="true">✎</span>
          แก้ไขข้อมูล
        </button>
      </header>

      <section className="data-card">
        <div className="data-card-heading">
          <div className="data-heading-icon" aria-hidden="true">
            <span>U</span>
          </div>

          <div>
            <h2>รายละเอียดบัญชี</h2>
            <p>ข้อมูลที่ใช้สำหรับติดต่อและยืนยันตัวตน</p>
          </div>
        </div>

        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">รหัสผู้ใช้งาน</span>
            <p>{myId ?? "-"}</p>
          </div>

          <div className="data-item">
            <span className="data-label">ชื่อ-นามสกุล</span>
            <p>
              {[profile.First_Name, profile.Last_Name]
                .filter(Boolean)
                .join(" ") || "-"}
            </p>
          </div>

          <div className="data-item">
            <span className="data-label">เบอร์โทรศัพท์</span>
            <p>{profile.Phone || "-"}</p>
          </div>

          <div className="data-item">
            <span className="data-label">เพศ</span>
            <p>{formatGender(profile.Gender)}</p>
          </div>

          <div className="data-item">
            <span className="data-label">วันเกิด</span>
            <p>{formatThaiDate(profile.Birth_Date)}</p>
          </div>

          <div className="data-item data-address-item">
            <span className="data-label">ที่อยู่เริ่มต้น</span>
            <p>{addressText}</p>
            {defaultAddress && (
              <span className="default-address-badge">
                ที่อยู่เริ่มต้น
              </span>
            )}
          </div>
        </div>

        <div className="data-card-footer">
          <span className="data-status-dot" />
          ข้อมูลโปรไฟล์ของคุณ
        </div>
      </section>
    </main>
  );
});
