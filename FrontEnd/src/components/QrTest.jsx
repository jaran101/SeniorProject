import { useRef,useEffect, useState } from "react";
import generatePayload from "promptpay-qr";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import axios from "axios";
import "./QrTest.css";
function QrTest() {
  const [phone, setPhone] = useState(""); // เปลี่ยนเป็นเลขของคุณ
  const [amount, setAmount] = useState(1);
  const payload = generatePayload(phone, { amount });
  const location = useLocation();
  const { orderId } = location?.state || {};
  const [order, setOrder] = useState(null);
  const [tech_id, setTech_id] = useState(null);
  const [techName, setTechName] = useState(null);
  const fileRef = useRef(null);
  const [slip, setSlip] = useState(null); // เก็บไฟล์ที่เลือก
  const [preview, setPreview] = useState(null); // เก็บ URL ไว้โชว์ตัวอย่าง
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readuserorder/${orderId}`,
        );
        setOrder(response.data.result);
        setAmount(response.data.result[0]?.Final_Price || 1); // ตั้งค่า amount จาก Final_Price ของ order
        setTech_id(response.data.result[0]?.Tech_Id);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!tech_id) return;
    const fetchTech = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readprofile/${tech_id}`,
        );
        const { PromptPay_Id, First_Name, Last_Name } = response.data.result;
        setTechName(`${First_Name} ${Last_Name}`);
        setPhone(PromptPay_Id);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchTech();
  }, [tech_id]);

  const handleDownload = async () => {
    try {
      const qrCanvas = document.getElementById("qr-canvas");
      if (!qrCanvas) return;

      const W = 495;
      const H = 640;
      const card = document.createElement("canvas");
      card.width = W;
      card.height = H;
      const ctx = card.getContext("2d");

      // 1) พื้นหลังขาว
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // 2) แถบหัวสีน้ำเงิน
      ctx.fillStyle = "#0f3d6e";
      ctx.fillRect(0, 0, W, 105);

      // 3) โลโก้
      const sx = 305,
        sy = 40,
        sw = 430,
        sh = 178;
      const dw = 250;
      const dh = dw * (sh / sw);
      const logo = await loadImage("/thaiqr.png");
      ctx.drawImage(logo, sx, sy, sw, sh, (W - dw) / 2, 0, dw, dh);
      // 4) QR Code
      ctx.drawImage(qrCanvas, (W - 300) / 2, 190, 300, 300);

      // 5) ข้อความด้านล่าง
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      ctx.font = "bold 28px sans-serif";
      ctx.fillText(techName || "", W / 2, 540, W - 40);

      ctx.font = "22px sans-serif";
      ctx.fillText(`พร้อมเพย์: ${phone}`, W / 2, 580);

      ctx.font = "bold 26px sans-serif";
      ctx.fillText(`${amount} บาท`, W / 2, 620);

      const link = document.createElement("a");
      link.href = card.toDataURL("image/png");
      link.download = `qr-order-${orderId || "promptpay"}.png`;
      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`โหลดรูปไม่ได้: ${src}`));
      img.src = src;
    });

    const handleSelectSlip = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setSlip(file)
  setPreview(URL.createObjectURL(file))

};
  return (
    <div className="QrPage">
      <h2>FixChang Prompay</h2>

      <div style={{ marginTop: 16 }}>
        <QRCodeCanvas
          id="qr-canvas"
          value={payload}
          size={300}
          style={{ width: 200, height: 200 }}
          level="H"
          imageSettings={{
            src: "/imagesPrompay.png",
            height: 60,
            width: 60,
            excavate: true,
          }}
        />
      </div>

      <div>{techName}</div>
      <div>
        <label>เลขพร้อมเพย์: {phone} </label>
      </div>
      <div>
        <label>ยอดเงิน: </label>
        {amount} บาท
      </div>
      <p>
        หลังจากทำการชำระเงินแล้วอย่าลืมส่งใบเสร็จการชำระเงินเพื่อเป็นหลักฐานให้ช่างด้วยนะครับ
      </p>
      <button onClick={handleDownload} className="Button_DownLoad">
        ดาวน์โหลด QR
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleSelectSlip}
        hidden
      />
      <button onClick={() => fileRef.current.click()}>แนบสลิป</button>
    </div>
  );
}

export default QrTest;
