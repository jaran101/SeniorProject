import { useState } from "react";
import axios from "axios";
import Newprofile from "./newprofile";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email) {
      nextErrors.Email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.Email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!password) {
      nextErrors.Password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 6) {
      nextErrors.Password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    } else if (!/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      nextErrors.Password = "รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข";
    } else if (/\s/.test(password)) {
      nextErrors.Password = "รหัสผ่านไม่ควรมีช่องว่าง";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        setMessage("ลงทะเบียนสำเร็จ กำลังเข้าสู่ระบบ...");

        const loginResponse = await axios.post("http://localhost:3000/api/login", {
          Email: email,
          Password: password,
        });

        if (loginResponse.status === 200) {
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("user", JSON.stringify(loginResponse.data));
          setShow(true);
        }
      }
    } catch (error) {
      console.log("error:", error);
      setMessage("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="f1">สมัครสมาชิก</p>

      <div>
        <label className="f3">Email</label>
        <input
          className={errors.Email ? "ri1 error" : "ri1"}
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {errors.Email && <p className="err-msg">{errors.Email}</p>}
      </div>

      <div className="row">
        <div>
          <label className="f3">รหัสผ่าน</label>
          <input
            className={errors.Password ? "ri1 error" : "ri1"}
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {errors.confirmPassword && <p className="err-msg">{errors.confirmPassword}</p>}
        </div>
      </div>

      {message && <p className="msg">{message}</p>}

      <hr className="hr1" />

      <button className="button" onClick={handleRegister} disabled={loading}>
        {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
      </button>

      <div>{show && <Newprofile />}</div>
    </div>
  );
}