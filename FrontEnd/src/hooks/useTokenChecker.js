import { useState, useEffect, useCallback } from "react";

const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const useTokenChecker = (intervalMs = 5000) => {
  const [status, setStatus] = useState("idle"); // idle | valid | warning | expired | invalid
  const [timeLeft, setTimeLeft] = useState(null);
  const [user, setUser] = useState(null);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("idle");
      setTimeLeft(null);
      setUser(null);
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded || !decoded.exp) {
      setStatus("invalid");
      setTimeLeft(null);
      setUser(null);
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = decoded.exp - now;

    setUser({ email: decoded.email, role: decoded.role });
    setTimeLeft(secondsLeft);

    if (secondsLeft <= 0) {
      setStatus("expired");
      localStorage.removeItem("token"); // ลบ token ที่หมดอายุออก
    } else if (secondsLeft <= 10) {
      setStatus("warning"); // ⚠️ ใกล้หมดอายุ
    } else {
      setStatus("valid");
    }
  }, []);

  useEffect(() => {
    checkToken(); // เช็คทันทีตอน mount
    const interval = setInterval(checkToken, intervalMs);
    return () => clearInterval(interval); // cleanup
  }, [checkToken, intervalMs]);

  return { status, timeLeft, user, checkToken };
};