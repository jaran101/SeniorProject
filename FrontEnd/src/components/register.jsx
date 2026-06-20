import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Newprofile from "./newprofile";

export default function Register() {

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // เพิ่ม loading
  const navigate = useNavigate();
  const[show,setShow]=useState(false);

  const validate = () => {
    const newErrors = {};
    if (!Email)
      newErrors.Email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(Email))
      newErrors.Email = "รูปแบบอีเมลไม่ถูกต้อง";

    if (!Password)
      newErrors.Password = "กรุณากรอกรหัสผ่าน";
    else if (Password.length < 6)
      newErrors.Password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    else if (!/\d/.test(Password) || !/[A-Za-z]/.test(Password))
      newErrors.Password = "รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข";
    else if (/\s/.test(Password))
      newErrors.Password = "รหัสผ่านไม่ควรมีช่องว่าง";

    if (!confirmPassword)
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    else if (Password !== confirmPassword)
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. สมัครสมาชิก
      const response = await axios.post("http://localhost:3000/api/register", {
        Email,
        Password,
      });

      if (response.status === 200) {
        setMessage("ลงทะเบียนสำเร็จ กำลังเข้าสู่ระบบ...");

        // 2. Login อัตโนมัติ
        const loginResponse = await axios.post("http://localhost:3000/api/login", {
          Email,
          Password,
        });

        if (loginResponse.status === 200) {
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("user", JSON.stringify(loginResponse.data));
          const open =(e)=>{setShow(true);}
          open();
          //navigate("/"); // ไปหน้าแรกเลย
        }
      }
    } catch (error) {
      console.log("error:", error);
      setMessage("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setLoading(false); // ปิด loading เสมอ
    }
  };

  return (
    <div>
      <p className="f1">สมัครสมาชิก</p>

      {/* ── อีเมล ── */}
      <div>
        <label className="f3">Email</label>
        <input
          className={errors.Email ? "ri1 error" : "ri1"}
          type="email"
          placeholder="อีเมล"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.Email && <p className="err-msg">{errors.Email}</p>}
      </div>

      {/* ── รหัสผ่าน + ยืนยัน ── */}
      <div className="row">
        <div>
          <label className="f3">รหัสผ่าน</label>
          <input
            className={errors.Password ? "ri1 error" : "ri1"}
            type="password"
            placeholder="รหัสผ่าน"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.Password && <p className="err-msg">{errors.Password}</p>}
        </div>

        <div>
          <label className="f3">ยืนยันรหัสผ่าน</label>
          <input
            className={errors.confirmPassword ? "ri1 error" : "ri1"}
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="err-msg">{errors.confirmPassword}</p>}
        </div>
      </div>

      {message && <p className="msg">{message}</p>}

      <hr className="hr1" />

      {/* disabled ระหว่าง loading */}
      {}
      <button className="button" onClick={handleRegister} disabled={loading}>
        {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
      </button>

      <div>
        {show && <Newprofile/>}
      </div>
    </div>
  );
}