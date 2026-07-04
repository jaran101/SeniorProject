import { useTokenChecker } from "../hooks/useTokenChecker";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const statusConfig = {
  idle: { icon: "⚪", label: "ยังไม่ได้ Login" },
  valid: { icon: "✅", label: "Token ปกติ" },
  warning: { icon: "⚠️", label: "Token ใกล้หมดอายุ!" },
  expired: { icon: "❌", label: "Token หมดอายุแล้ว" },
  invalid: { icon: "🚫", label: "Token ไม่ถูกต้อง" },
};

export default function TokenStatus() {
  const { status, timeLeft, user } = useTokenChecker(3000);
  const navigate = useNavigate();
  const cfg = statusConfig[status];

  // ถ้า token หมดอายุให้ redirect ไปหน้า login
  useEffect(() => {
    if (status === "expired") {
      navigate("/lar");
    }
  }, [navigate, status]);



  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* แสดงสถานะปัจจุบันของ token */}
      <p style={{ fontWeight: "bold", fontSize: "16px" }}>
        {cfg.icon} {cfg.label}
      </p>

      {/* แสดงข้อมูลผู้ใช้เมื่อมีข้อมูลอยู่ */}
      {user && (
        <p style={{ fontSize: "14px", marginTop: "4px" }}>
          👤 {user.email} ({user.role})
        </p>
      )}

      {/* แสดงเวลาที่เหลือก่อน token หมดอายุ */}
      {timeLeft > 0 && (
        <p style={{ fontSize: "14px", marginTop: "4px" }}>
          ⏱ เหลืออีก {timeLeft} วินาที
        </p>
      )}
    </div>
  );
}