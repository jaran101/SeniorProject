import axios from "axios";
import { useEffect, useState} from "react";
import UpdateAddress from "./updateaddress.jsx";
import "./ReadMyAddresses.css";

export default function ReadMyAddresses({myId, addresses, setAddresses}){
    const [editingId, setEditingId] = useState(null);

    const handleUpdate = (addressId) => {
        setEditingId(prev => (prev === addressId ? null : addressId));
    }
    
    useEffect(() => {
        const fetchMyAddresses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/readmyaddresses/${myId}`, {
                });
                setAddresses(response.data.result);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        }
        fetchMyAddresses();


    }, [myId]);

    const handleSetDefault = async (addressId) => {
const target = addresses.find(a => a.Address_Id === addressId);
if (!target) return;

    try {
        await axios.put(`http://localhost:3000/api/updateaddress/${addressId}`, {
            Users_Id: myId,
            Address: target.Address,
            Province: target.Province,
            District: target.District,
            Subdistrict: target.Subdistrict,
            Postal_Code: target.Postal_Code,
            Latitude: target.Latitude,
            Longitude: target.Longitude,
            Is_Default: true
        });
        
        setAddresses

       setAddresses(prev =>
    prev.map(addr => ({
        ...addr,
        Is_Default: addr.Address_Id === addressId
    }))
);


    } catch (error) {
        console.error("Error setting default address:", error.response?.data?.message);
    }
};


const handleDelete = async (addressId) => {
    try {
        await axios.delete(`http://localhost:3000/api/removeaddress/${addressId}`,
            {
                data: {
                    Users_Id: myId,
                    Address_Id: addressId
                }
            }
        );

        setAddresses(prev => prev.filter(a => a.Address_Id !== addressId));
    } catch (error) {
        console.error("Error deleting address:", error.response?.data?.message);
    }
};




    return(
        <div>
            <h1>ที่อยู่ของฉัน</h1>

            <table>
                <thead>
            <tr>
                <th>ที่อยู่</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>จังหวัด</th>
                <th>รหัสไปรษณีย์</th>
                <th>เป็นค่าเริ่มต้น</th>
                <th>แก้ไข</th>
                <th>ลบ</th>
            </tr>
               </thead>
               <tbody>
                {addresses.map(address => (
                    <tr key={address.Address_Id}>
                        <td>{address.Address}</td>
                        <td>{address.District}</td>
                        <td>{address.Subdistrict}</td>
                        <td>{address.Province}</td>
                        <td>{address.Postal_Code}</td>
                        <td>
                            <input
                                type="radio"
                                name="defaultAddress"
                                checked={address.Is_Default}

                                onChange={() => handleSetDefault(address.Address_Id)}
                            />
                        </td>
                        <td><button className="UpdateLocation" onClick={() => handleUpdate(address.Address_Id)}>
                                {editingId === address.Address_Id ? "ปิด" : "แก้ไข"}
                            </button></td>
                        <td><button className="DeleteLocation" onClick={() => handleDelete(address.Address_Id)}>ลบ</button></td>
                    </tr>
                ))}
               </tbody>
            </table>
            {editingId !== null && (
                <UpdateAddress
                    myId={myId}
                    address={addresses.find(a => a.Address_Id === editingId)}
                />
            )}
        </div>
    )
}