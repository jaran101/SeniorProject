
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateAddress from "./updateaddress.jsx";
import "./ReadMyAddresses.css";

export default function ReadMyAddresses({
  myId,
  addresses = [],
  setAddresses,
}) {
  const [editingId, setEditingId] = useState(null);

  const fetchMyAddresses = async () => {
    if (!myId) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/readmyaddresses/${myId}`
      );

      setAddresses(response.data.result ?? []);
    } catch (error) {
      console.error(
        "Error fetching addresses:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchMyAddresses();
  }, [myId]);

  const handleUpdate = (addressId) => {
    setEditingId((prev) =>
      prev === addressId ? null : addressId
    );
  };

  const handleSetDefault = async (addressId) => {
    const target = addresses.find(
      (address) => address.Address_Id === addressId
    );

    if (!target) return;

    try {
      await axios.put(
        `http://localhost:3000/api/updateaddress/${addressId}`,
        {
          Users_Id: myId,
          Address: target.Address,
          Province: target.Province,
          District: target.District,
          Subdistrict: target.Subdistrict,
          Postal_Code: target.Postal_Code,
          Latitude: target.Latitude,
          Longitude: target.Longitude,
          Is_Default: true,
        }
      );

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          Is_Default: address.Address_Id === addressId,
        }))
      );
    } catch (error) {
      console.error(
        "Error setting default address:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "คุณต้องการลบที่อยู่นี้ใช่หรือไม่?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/removeaddress/${addressId}`,
        {
          data: {
            Users_Id: myId,
            Address_Id: addressId,
          },
        }
      );

      setAddresses((prev) =>
        prev.filter(
          (address) => address.Address_Id !== addressId
        )
      );

      if (editingId === addressId) {
        setEditingId(null);
      }
    } catch (error) {
      console.error(
        "Error deleting address:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleAddressUpdated = () => {
    setEditingId(null);
    fetchMyAddresses();
  };

  return (
    <section className="addresses-section">
      <div className="addresses-header">
        <div>
          <h2>ที่อยู่ของฉัน</h2>
          <p>จัดการที่อยู่และเลือกที่อยู่เริ่มต้นสำหรับการใช้บริการ</p>
        </div>

        <span className="addresses-count">
          {addresses.length} ที่อยู่
        </span>
      </div>

      {addresses.length === 0 ? (
        <div className="addresses-empty">
          ยังไม่มีข้อมูลที่อยู่
        </div>
      ) : (
        <div className="addresses-table-wrapper">
          <table className="addresses-table">
            <thead>
              <tr>
                <th>ที่อยู่</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>จังหวัด</th>
                <th>รหัสไปรษณีย์</th>
                <th>ค่าเริ่มต้น</th>
                <th>แก้ไข</th>
                <th>ลบ</th>
              </tr>
            </thead>

            <tbody>
              {addresses.map((address) => (
                <tr key={address.Address_Id}>
                  <td className="">
                    {address.Address}
                  </td>

                  <td>{address.District}</td>
                  <td>{address.Subdistrict}</td>
                  <td>{address.Province}</td>
                  <td>{address.Postal_Code}</td>

                  <td className="default-address-cell">
                    <label className="default-address-label">
                      <input
                        type="radio"
                        name="defaultAddress"
                        checked={Boolean(address.Is_Default)}
                        onChange={() =>
                          handleSetDefault(address.Address_Id)
                        }
                        aria-label={`ตั้งที่อยู่นี้เป็นค่าเริ่มต้น`}
                      />

                      {address.Is_Default ? "ค่าเริ่มต้น" : ""}
                    </label>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="UpdateLocation"
                      onClick={() =>
                        handleUpdate(address.Address_Id)
                      }
                    >
                      {editingId === address.Address_Id
                        ? "ปิด"
                        : "แก้ไข"}
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="DeleteLocation"
                      onClick={() =>
                        handleDelete(address.Address_Id)
                      }
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId !== null && (
        <div className="update-address-panel">
          <UpdateAddress
            key={editingId}
            myId={myId}
            address={addresses.find(
              (address) => address.Address_Id === editingId
            )}
            onAddressUpdated={handleAddressUpdated}
          />
        </div>
      )}
    </section>
  );
}
