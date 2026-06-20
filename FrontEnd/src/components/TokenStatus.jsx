import { useTokenChecker } from "../hooks/useTokenChecker";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const statusConfig = {
  idle:    { icon: "⚪", label: "ยังไม่ได้ Login",     color: "#6b7280" },
  valid:   { icon: "✅", label: "Token ปกติ",           color: "#15803d" },
  warning: { icon: "⚠️", label: "Token ใกล้หมดอายุ!",  color: "#b45309" },
  expired: { icon: "❌", label: "Token หมดอายุแล้ว",   color: "#b91c1c" },
  invalid: { icon: "🚫", label: "Token ไม่ถูกต้อง",    color: "#b91c1c" },
};

export default function TokenStatus() {
  const { status, timeLeft, user } = useTokenChecker(3000);
  const navigate = useNavigate(); // ← ต้องมี () ด้วย
  const cfg = statusConfig[status];

  // Redirect ไปหน้า Login เมื่อ Token หมดอายุ
  useEffect(() => {
    if (status === "expired") {
      navigate("/lar");
    }
  }, [status]);



  return (
    <div 
    >
      {/*<p style={{ fontWeight: "bold", fontSize: "16px" }}>
        {cfg.icon} {cfg.label}
      </p>
      {user && (
        <p style={{ fontSize: "14px", marginTop: "4px" }}>
          👤 {user.email} ({user.role})
        </p>
      )}
      {timeLeft > 0 && (
        <p style={{ fontSize: "14px", marginTop: "4px" }}>
          ⏱ เหลืออีก {timeLeft} วินาที
        </p>
      )}*/}
    </div>
  );
}