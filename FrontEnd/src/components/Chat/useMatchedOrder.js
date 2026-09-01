import { useEffect, useState } from "react";
import axios from "axios";

function useMatchedOrder(Tech_Id, Service_Id, User_Id, targetStatus) {
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Tech_Id || !Service_Id || !User_Id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:3000/api/readtechorder/${Tech_Id}`,
          {
            headers: {
              authorization: localStorage.getItem("token")
            }
          }
        );

        const allOrders = res.data.result || [];

        let matched = allOrders.filter(
          (o) => String(o.Service_Id) === String(Service_Id)
        );

        matched = matched.filter(
          (o) => String(o.Users_Id) === String(User_Id)
        );

        if (targetStatus) {
          matched = matched.filter(
            (o) => o.Status === targetStatus
          );
        }

        if (matched.length === 0) {
          setOrderId(null);
          setError("ไม่พบ Order");
          return;
        }

        matched.sort(
          (a, b) =>
            new Date(b.Created_At) - new Date(a.Created_At)
        );

        setOrderId(matched[0].Order_Id);

      } catch (err) {
        console.error(err);
        setOrderId(null);

        setError(
          err?.response?.data?.message ||
          "เกิดข้อผิดพลาดในการดึง Order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [Tech_Id, Service_Id, User_Id, targetStatus]);

  return {
    orderId,
    loading,
    error
  };
}

export default useMatchedOrder;