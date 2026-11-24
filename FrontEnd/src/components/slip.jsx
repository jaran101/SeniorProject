import "./slip.css";

export default function Slip({ orderId, payment }) {
    console.log(payment);

    return (
            <div className="slip-card">
                <h2 className="slip-title">หลักฐานการชำระเงิน</h2>

                <p className="slip-order">
                    Order ID : <span>{orderId}</span>
                </p>

                  {payment.Slip_Image ? (  <img
                        className="img_slip"
                        src={`http://localhost:3000/uploads/${payment?.Slip_Image}`}
                        alt="Payment Slip"
                    />):
                    (<div><p className="Warring_Text">ยังไม่มีใบเสร็จการโอน</p>
                    <p> กรุณาตรวจสอบการชำระเงินก่อนกดยืนยันด้วย</p></div>)}
                    <button>ยืนยัน</button>
                    <button>ปฏิเสธ</button>
                </div>
    );
}