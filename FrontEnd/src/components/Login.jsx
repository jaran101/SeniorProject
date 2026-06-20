import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    const newErrors = {};
    if (!Email) newErrors.Email = "กรุณากรอกอีเมล";
    if (!Password) newErrors.Password = "กรุณากรอกรหัสผ่าน";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        Email: Email,
        Password: Password
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.payload.id);
        localStorage.setItem("user", JSON.stringify(response.data));
        alert("เข้าสู่ระบบสำเร็จ");
        console.log("response:", response.data);
        navigate("/");
      }
    } catch (error) {
      setErrors({ api: "email หรือ password ไม่ถูกต้อง" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div>
      <p className="form-title">เข้าสู่ระบบ</p>
      <p className="form-sub">ยินดีต้อนรับกลับมา</p>

      {errors.api && <p className="err-msg">{errors.api}</p>}

      <div className="field">
        <label>Email</label>
        <input
          type="text"
          className={errors.Email ? "i1 error" : "i1"}
          placeholder="อีเมล"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {errors.Email && <p className="err-msg">{errors.Email}</p>}
      </div>

      <div className="field">
        <label>Password</label>
        <input
          type="password"
          className={errors.Password ? "i1 error" : "i1"}
          placeholder="••••••••"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {errors.Password && <p className="err-msg">{errors.Password}</p>}
      </div>
      <br />
      <button className="button" onClick={handleLogin} disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "ดำเนินการต่อ"}
      </button>

      <hr className="line" />

      <div className="box2">
        <a href="/forgot" className="a">ลืมรหัสผ่าน?</a>
      </div>
    </div>
  );
}