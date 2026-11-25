import { useRef, useEffect, useState } from "react";
import generatePayload from "promptpay-qr";
import { QRCodeCanvas } from "qrcode.react";

import axios from "axios";
import "./QrTest.css";
import { getStatusText } from "../utils/orderStatus";
function QrTest({ orderId, onClose, onUploaded }) {
  const [phone, setPhone] = useState(""); // เปลี่ยนเป็นเลขของคุณ
  const [amount, setAmount] = useState(1);
  const payload = generatePayload(phone, { amount });
  const [order, setOrder] = useState(null);
  const [tech_id, setTech_id] = useState(null);
  const [techName, setTechName] = useState(null);
  const localUserId = JSON.parse(localStorage.getItem("user"))?.payload?.id;
  const token = localStorage.getItem("token");
  const fileRef = useRef(null);
  const [slip, setSlip] = useState(null); // เก็บไฟล์ที่เลือก
  const [showSlipImage,setShowSlipImage]=useState(null);
  const [preview, setPreview] = useState(null); // เก็บ URL ไว้โชว์ตัวอย่าง
  console.log("orderId:", orderId)
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
  }



  const handleUploadSlip = async() => {
    if (!preview) return;
        const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("Order_Id",orderId)
    formData.append("Users_Id", user?.payload?.id);
    formData.append("file", slip);
    try {
        const response = await axios.post("http://localhost:3000/api/uploadslip", formData, {
      headers: { authorization: localStorage.getItem("token") },
    });
    console.log(response.data.result)
    alert("ส่งสลิปแล้ว");
   onUploaded();   // สั่งให้ User ดึง payment ใหม่
    onClose();  
    } catch (err) {
      alert(err.response?.data?.message || "ส่งสลิปไม่สำเร็จ");
      console.log(err.response?.data?.message || "ส่งสลิปไม่สำเร็จ"); 
    }
  };

    const fetchPayments = async () => {
        try{
          const response = await axios.get(`http://localhost:3000/api/readpayment/${orderId}`,
                        {
              params: { Users_Id: localUserId },
              headers: { authorization: token },
            },
          )
          setShowSlipImage(response.data.result)
          console.log("Show",showSlipImage)
        }catch(err){
          console.log(err.response?.data?.message || err.message);
        }
    };

  useEffect(() => {
    fetchPayments();
  }, [orderId]);

return (
  <div className="QrPage">
    <div className="divHead">
          <h2>FixChang Prompay</h2>
    </div>

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
        <div className="QR_Detail">
    <div>{techName}</div>
    <div>
      <label>เลขพร้อมเพย์: {phone} </label>
    </div>
    <div>
      <label>ยอดเงิน: </label>
      {amount} บาท
    </div>
    </div>
    <p>
      หลังจากทำการชำระเงินแล้วอย่าลืมส่งใบเสร็จการชำระเงินเพื่อเป็นหลักฐานให้ช่างด้วยนะครับ
    </p>
      
      <div>
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
    <button className="Immage_Import" onClick={() => fileRef.current.click()}>เลือกไฟล์</button>
</div>
    {preview && (
      <div >
        <div className="div_Slip_Button">

        <button onClick={() => setPreview(null)} className="Slip_close">x</button>
        <button className="Upload_Slip" onClick={handleUploadSlip}>อัปโหลดสลิป</button>
        
        </div>

        <div> 
          <img src={preview} alt="" className="Slip_Image" />
        </div>
      


      </div>
    )}
      {showSlipImage?.Slip_Image && (
  <div>
    <div className="RejectText">
    <p>สลิปที่ส่งไปแล้ว</p>
     <p>สถานะ:{getStatusText(showSlipImage.Status)}</p>
     <p>สาเหตุ:{showSlipImage.Reject_Reason}</p>  
        </div>
      <img
      src={`http://localhost:3000/uploads/${showSlipImage.Slip_Image}`}
      alt=""
      className="Slip_Image"
    />
  </div>
)}
  </div>
);
}

export default QrTest;
