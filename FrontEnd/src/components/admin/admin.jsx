import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Admin() {
  const [amountUser, setAmountUser] = useState(null);
  const [amountService, setAmountService] = useState(null);
  const [allUser, setAllUser] = useState(null);
  const [amountOrder, setAmountOrder] = useState(null);
  useEffect(() => {
    const fetchAmountUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/amountuser",
        );
        setAmountUser(response.data.result);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };
    const fetchAmountService = async () => {
      try {
        const responseService = await axios.get(
          `http://localhost:3000/api/listservice`,
        );
        setAmountService(responseService.data.result.length);
        console.log(responseService.data.result.length);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };

    const fetchALLUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/listuser");
        console.log(response.data.result);
        setAllUser(response.data.result);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };

    const fetchAmountOrder = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/listorder");
            console.log(response.data.result);
            setAmountOrder(response.data.result);
        }catch (error) {
            console.error(error?.response?.data?.message || error.message);
            alert(error.message);
        }
    }

    fetchAmountUser();
    fetchAmountService();
    fetchALLUser();
    fetchAmountOrder();
  }, []);

  return (
    <div>
      <h1>จำนวนผู้ใช้งาน: {amountUser}</h1>
      <h1>จำนวนบริการ: {amountService}</h1>
      <h1>จำนวนคำสั่ง: {amountOrder?.length}</h1>
      <h1>รายชื่อผู้ใช้งาน:</h1>
      <ul>
        {allUser &&
          allUser.map((user) => (
            <li key={user.Users_Id}>
              {user.Users_Id}-{user.Firstname} {user.Lastname} - {user.Email}
            </li>
          ))}
      </ul>
    </div>
  );
}
