import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tech.css";
import { getStatusText } from "../../utils/orderStatus";
import Slip from "../slip";
export default function Tech({ techorder, onStartOrder, onFinishOrder }) {
  const [servicelist, setServicelist] = useState({});
  const [profilelist, setProfilelist] = useState({});
  const token = localStorage.getItem("token");
  const [paymentlist, setPaymentlist] = useState({});
  const [slipShow,setSlipShow]= useState(false);
  const [slipOrderId, setSlipOrderId] = useState(null);
  const localUserId = JSON.parse(localStorage.getItem("user"))?.payload?.id;
  const navigate = useNavigate();
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  useEffect(() => {
    const fetchservice = async () => {
      const results = await Promise.all(
        techorder.map((order) =>
          Promise.all([
            axios.get(
              `http://localhost:3000/api/readservice/${order.Service_Id}`,
            ),
            axios.get(
              `http://localhost:3000/api/readprofile/${order.Users_Id}`,
              {
                headers: { authorization: token },
              },
            ),
          ]),
        ),
      );

      const serviceMap = {};
      const profileMap = {};

      results.forEach(([serviceRes, profileRes], index) => {
        const service = serviceRes.data.result;
        const profile = profileRes.data.result;
        const order = techorder[index];
        serviceMap[service.Service_Id] = service;
        profileMap[order.Users_Id] = profile;
      });
      setServicelist(serviceMap);
      setProfilelist(profileMap);
    };
    fetchservice();
  }, [techorder]);

    useEffect(() => {
    const fetchPayments = async () => {
      const results = await Promise.all(
        techorder.map(async (order) => {
        if (order.Status !== "COMPLETED") return [order.Order_Id, null];

          try {
            const res = await axios.get(
              `http://localhost:3000/api/readpayment/${order.Order_Id}`,
              {
                params: { Users_Id: localUserId },
                headers: { authorization: token },
              },
            );
            console.log("payment",res.data.result)
            return [order.Order_Id, res.data.result];
          } catch (err) {
            return [order.Order_Id, null]; // 404 = ยังไม่มี payment
          }
        }),
      );
      setPaymentlist(Object.fromEntries(results));
    };
    fetchPayments();
  }, [techorder]);

  



  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>order</th>
            <th>บริการ</th>
            <th>สถานะ</th>
            <th>ลูกค้า</th>
            <th>วันเริ่มงาน</th>
            <th>วันสิ้นสุดงาน</th>
            <th>รายละเอียด</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {techorder.map((order) => (
            <tr key={order.Order_Id}>
              <td>{order.Order_Id}</td>
              <td>{servicelist[order.Service_Id]?.Title}</td>
              <td>
                {paymentlist[order.Order_Id]
                  ? getStatusText(paymentlist[order.Order_Id].Status)
                  : getStatusText(order.Status)}
              </td>
              <td>{profilelist[order.Users_Id]?.First_Name}</td>
              <td>{formatDate(order.Work_Date)}</td>
              <td>{formatDate(order.Work_Date_End)}</td>

              <td>
                <button
                  onClick={() =>
                    navigate("/DetailOrder", { state: { order: order } })
                }
                className="Detail_Button"
                >
                  รายละเอียด
                </button>
              </td>
              <td>
                {order.Status === "ACCEPTED" && (
                  <button
                    onClick={() => onStartOrder(order.Order_Id)}
                    className="Start_button"
                  >
                    เริ่มงาน
                  </button>
                )}
                {order.Status === "IN_PROGRESS" && (
                  <button  className="Finis_Button"  onClick={() => onFinishOrder(order.Order_Id)}>
                    เสร็จสิ้นงาน
                  </button>
                )}
                {paymentlist[order.Order_Id]?.Status === "WAITING_CONFIRMATION" || paymentlist[order.Order_Id]?.Status === "PENDING" && (
                 <button onClick={() => {setSlipShow(true),
                  setSlipOrderId(order.Order_Id);} }>
                    ตรวจสลิป
                  </button>
                )}
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {slipShow && (
            <div className="qr-overlay" onClick={() => setSlipShow(false)}>
              <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                <button className="qr-close" onClick={() => setSlipShow(false)}>
                  ×
                </button>
                <Slip
                    orderId={slipOrderId}
                    payment={paymentlist[slipOrderId]}
/>
              </div>
            </div>
          )}
    </div>
  );
}
