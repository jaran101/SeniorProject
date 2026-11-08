import { useState } from "react";
// TODO 1: import ฟังก์ชันสร้าง payload จาก "promptpay-qr" (default export)
import generatePayload from "promptpay-qr";
// TODO 2: import { QRCodeSVG } จาก "qrcode.react" (named export)
import { QRCodeSVG } from "qrcode.react";
function QrTest() {
  const [phone, setPhone] = useState(""); // เปลี่ยนเป็นเลขของคุณ
  const [amount, setAmount] = useState(1);

  // TODO 3: สร้าง payload จาก phone และ amount
  // รูปแบบ: ฟังก์ชัน(เลขพร้อมเพย์, { amount: ??? })
  const payload = generatePayload(phone,{amount});




  console.log(payload);

  return (
    <div style={{ padding: 24 }}>
      <h2>ทดลอง QR PromptPay</h2>

      <div>
        <label>เลขพร้อมเพย์: </label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <label>ยอดเงิน: </label>
        <input
          type="number"
          value={amount}
          // TODO 4: onChange ต้องแปลงค่าให้เป็น "ตัวเลข" ก่อน set
          // (ค่าจาก input เป็น string เสมอ ลองคิดว่าใช้ Number() ตรงไหน)
          onChange={(e)=>setAmount(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        {/* TODO 5: วาด QR โดยส่ง payload เข้า prop value
            และลองกำหนดขนาดด้วย prop size */}
            <QRCodeSVG  value={payload} size={200} level="H" imageSettings={{
            src: "../public/imagesPrompay.png",        // path ของรูปในโฟลเดอร์ public เช่น "/promptpay.png"
            height: 40,     // ลองเริ่มที่ 40
            width: 40,      // ลองเริ่มที่ 40
            excavate: true,   // true หรือ false
            }}/> 
      </div>

      <p style={{ wordBreak: "break-all" }}>{payload}</p>
    </div>
  );
}

export default QrTest;