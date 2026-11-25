import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  UserRound,
  Package,
  ClipboardList,
  UserRoundPlus,
} from "lucide-react";
import "./admin.css";
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
        // console.log(responseService.data.result.length);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };

    const fetchALLUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/listuser");
        // console.log("ListUser", response.data.result);
        setAllUser(response.data.result);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };

    const fetchAmountOrder = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/listorder");
        // console.log("FetchOrder", response.data.result);
        setAmountOrder(response.data.result);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
        alert(error.message);
      }
    };

    fetchAmountUser();
    fetchAmountService();
    fetchALLUser();
    fetchAmountOrder();
  }, []);

  const HandleUser = (userId) => {
    alert(`Hello World User ID: ${userId}`);
  };

  const HandleEdit = (userId) => {
    console.log("แก้ไขข้อมูล:", userId);
    alert(`แก้ไขข้อมูล User ID: ${userId}`);
  };

  const HandleDelete = (userId) => {
    const confirmDelete = window.confirm(
      `คุณต้องการลบ User ID ${userId} หรือไม่?`,
    );

    if (confirmDelete) {
      console.log("ลบ User ID:", userId);
    }
  };

  return (
    <div className="AdminPage">
      <div className="Data_Length">

        <div className="Leng_Data">
          <UserRound className="icon" />
          <p>จำนวนผู้ใช้งาน: {amountUser} คน</p>
        </div>
        
        <div className="Leng_Data">
          <Package className="icon"/>
                  <p>จำนวนบริการ: {amountService} งาน</p>
        </div>
        <div className="Leng_Data">
        <ClipboardList className="icon"/>
                  <p>จำนวนคำสั่งทั้งหมด: {amountOrder?.length} งาน</p>
        </div>
      </div>
      <h1>รายชื่อผู้ใช้งาน:</h1>
      <div className="Table_Data">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>เบอร์โทร</th>
              <th>Email</th>
              <th>สิทธิ์</th>
              <th>แก้ไข</th>
              <th>ลบ</th>
            </tr>
          </thead>

          <tbody>
            {allUser?.map((user) => (
              <tr key={user.Users_Id}>
                <td>{user.Users_Id}</td>

                <td>
                  <div className="text-ellipsis">
                    {user.Profile?.First_Name}
                  </div>
                </td>

                <td>
                  <div className="text-ellipsis">{user.Profile?.Last_Name}</div>
                </td>

                <td>{user.Profile?.Phone}</td>

                <td className="email-column">
                  <div className="text-ellipsis">{user.Email}</div>
                </td>
                <td>{user.Role}</td>




                <td>
                  <div>
                    <Pencil
                      className="Edit_Icon"
                      size={18}
                      onClick={() => HandleEdit(user.Users_Id)}
                    />
                  </div>
                </td>
                <td>
                  <div>
                    <Trash2
                      className="Delete_Icon"
                      size={18}
                      onClick={() => HandleDelete(user.Users_Id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
