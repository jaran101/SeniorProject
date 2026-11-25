import "./slip.css";
import { useState } from "react";
import axios from "axios";
export default function Slip({ orderId, payment, onDone }) {
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!payment) return null;

  const updateStatus = async (Status) => {
    if (Status === "REJECTED" && reason === "") {
      alert("อย่าลืมชี้แจงเหตุผลการปฎิเสธ");
      return;
    }
    try {
      await axios.patch(
        "http://localhost:3000/api/paymentupdatestatus",
        {
          Order_Id: orderId,
          Users_Id: user?.payload?.id,
          Status,
          Reject_Reason: Status === "REJECTED" ? reason : undefined,
        },
        { headers: { authorization: token } },
      );
      alert(Status === "PAID" ? "ยืนยันรับเงินแล้ว" : "ปฏิเสธสลิปแล้ว");
      onDone(); // อัปเดตสถานะในตารางและปิด popup
    } catch (err) {
      alert(err.response?.data?.message || "ทำรายการไม่สำเร็จ");
      console.log(err.response?.data?.message);
    }
  };

  const handleConfirm = () => {
    if (
      !payment.Slip_Image &&
      !window.confirm("ยังไม่มีสลิป ยืนยันว่าได้รับเงินแล้ว?")
    )
      return;
    updateStatus("PAID");
  };

  return (
    <div className="slip-card">
      <h2 className="slip-title">หลักฐานการชำระเงิน</h2>

      <p className="slip-order">
        Order ID : <span>{orderId}</span>
      </p>

      {payment?.Slip_Image ? (
        <img
          className="img_slip"
          src={`http://localhost:3000/uploads/${payment.Slip_Image}`}
          alt="Payment Slip"
        />
      ) : (
        <div className="slip-empty">
          <p className="Warring_Text">ยังไม่มีใบเสร็จการโอน</p>
          <p>กรุณาตรวจสอบการชำระเงินก่อนกดยืนยัน</p>
        </div>
      )}

      <div className="divA">
        <div className="div_Slip_Button">
          <button className="Succes_Slip" onClick={handleConfirm}>
            ยืนยัน
          </button>
          {payment.Slip_Image && (
            <button className="Reject_Slip" onClick={() => setRejecting(true)}>
              ปฏิเสธ
            </button>
          )}
        </div>
        {rejecting && (
          <div className="reject_Resson">
            <textarea
              className="Resson"
              placeholder="เหตุผลการปฏิเสธ"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              className="Reject_Slip"
              onClick={() => updateStatus("REJECTED")}
            >
              ส่งการปฏิเสธ
            </button>
            <button
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
