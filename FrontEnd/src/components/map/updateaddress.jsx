    import 'leaflet/dist/leaflet.css';
    import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import './CustomerMap.css';

    function RecenterMap({ position,zoom  }) {
        const map = useMap();

        useEffect(() => {

            map.setView(position, zoom);
        }, [position, map]);

        return null;
    }


        function LocationMarker({ onSelect }) {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                onSelect([lat, lng]);
            }
        });
        return null; 
    }


    function ZoomTracker({ onZoomChange }) {
        const map = useMapEvents({
            zoomend: () => {
                const currentZoom = map.getZoom();
                onZoomChange(currentZoom);
            }
        });
        return null;
    }


    export default function UpdateAddress({myId, address}) {
        const [position, setPosition] = useState([13.7563, 100.5018]);
        const [zoom, setZoom] = useState(13);

        const [addressText, setAddressText] = useState("");
        const [province, setProvince] = useState([]);
        const [selectedProvince, setSelectedProvince] = useState("");

        const [district, setDistrict] = useState([]);
        const [selectedDistrict, setSelectedDistrict] = useState("");

        const [subdistrict, setSubdistrict] = useState([]);
        const [selectedSubdistrict, setSelectedSubdistrict] = useState("");

        const [zipcode, setZipcode] = useState("");

        const [provinceId, setProvinceId] = useState("");
        const [districtId, setDistrictId] = useState("");

        const [subdistrictId, setSubdistrictId] = useState("");
    /*-----------------------------------------------*/
    const handleGetLocation = () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by this browser.");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    alert("Unable to retrieve your location.");
                },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }

            );
        };


useEffect(() => {
    if (!address || province.length === 0) return;

    setAddressText(address.Address || "");
    setSelectedProvince(address.Province || "");
    setSelectedDistrict(address.District || "");
    setSelectedSubdistrict(address.Subdistrict || "");
    setZipcode(address.Postal_Code || "");

    setPosition([
        address.Latitude ?? 13.7563,
        address.Longitude ?? 100.5018
    ]);

    // หา Province ID จากชื่อจังหวัด
    const foundProvince = province.find(
        (item) => item.Name === address.Province
    );

    if (foundProvince) {
        setProvinceId(foundProvince.Province_Id);
    }
}, [address, province]);


useEffect(() => {

    const fetchProvince =async () => {
        try{
            const response = await axios.get("http://localhost:3000/api/readprovinces")
            setProvince(response.data.result)
        } catch(error) {
            console.log(error.response.data.message)
        }
    }
    fetchProvince()
}, []);
//-----------------------------------------------------------
useEffect(() => {
    if (!provinceId) {
        setDistrict([]);
        return;
    }

    const fetchDistricts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/readdistricts/${provinceId}`
            );

            const districts = response.data.result;

            setDistrict(districts);

            // ถ้ามี address เดิม ให้หา District ID
            if (address?.District) {
                const foundDistrict = districts.find(
                    (item) => item.Name === address.District
                );

                if (foundDistrict) {
                    setDistrictId(foundDistrict.District_Id);
                }
            }

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    fetchDistricts();
}, [provinceId, address]);
//------------------------------------------------------------------------------------
useEffect(() => {
    if (!districtId) {
        setSubdistrict([]);
        return;
    }

    const fetchSubdistricts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/readsubdistricts/${districtId}`
            );

            const subdistricts = response.data.result;

            setSubdistrict(subdistricts);

            // ถ้ามี address เดิม ให้หา Subdistrict ID
            if (address?.Subdistrict) {
                const foundSubdistrict = subdistricts.find(
                    (item) => item.Name === address.Subdistrict
                );

                if (foundSubdistrict) {
                    setSubdistrictId(
                        foundSubdistrict.Subdistrict_Id
                    );
                    setZipcode(
                        foundSubdistrict.Postal_Code ?? ""
                    );
                }
            }

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    fetchSubdistricts();
}, [districtId, address]);


//---------------------------------------------------------------------------
useEffect(() => {
    if (!selectedSubdistrict) {
        setZipcode("");
        return;
    }

    const selected = subdistrict.find(
    (item) => String(item.Subdistrict_Id) === String(subdistrictId)
    );

    if (selected) {
        setZipcode(selected.Postal_Code ?? "");
    }
}, [selectedSubdistrict, subdistrict]);

//------------------------------------------------------------------------------------
const handleUpdateLocation = async () => {
    try {
        const response = await axios.put(
            `http://localhost:3000/api/updateaddress/${address.Address_Id}`,
            {
                Users_Id: myId,
                Address: addressText,
                Province: selectedProvince,
                District: selectedDistrict,
                Subdistrict: selectedSubdistrict,
                Postal_Code: zipcode,
                Latitude: position[0],
                Longitude: position[1],
                Is_Default: address.Is_Default,
            }
        );
        alert("แก้ไขที่อยู่สำเร็จ");
        console.log(response.data.message);
    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.msg || "กรุณาลองใหม่"));
    }
};








        return (
            <div>
            <div className="CustomerMap">
                <div className='inputMapContainer'>
               <div> 
                <p>Current Position: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p></div>
               <div>
            <select className='inputMap-province' value={selectedProvince} onChange={(e) => {
                        const name = e.target.value;
                        setSelectedProvince(name);

                        const found = province.find((item) => item.Name === name);
                        setProvinceId(found ? found.Province_Id : "");

                        setSelectedDistrict("");
                    }}
                    >
                    <option value="">จังหวัด</option>
                    {province.map((item) => (
                        <option key={item.Province_Id} value={item.Name}>{item.Name}</option>
                    ))}
                    </select>
            
                <select name="district" id="district" 
                className='inputMap-district' 
                value={selectedDistrict}
                onChange={(e) => {
                    const name = e.target.value;
                    setSelectedDistrict(name);

                    const found = district.find((item) => item.Name === name);
                    setDistrictId(found ? found.District_Id : "");

                    // รีเซ็ต subdistrict เดิมเพราะอำเภอเปลี่ยนไปแล้ว
                    setSelectedSubdistrict("");
                }}
                >
                    <option value="">อำเถอ/เขต/แขวง</option>
                    {district.map((item) => (
                        <option key={item.District_Id} value={item.Name}>{item.Name}</option>
                    ))}
                </select>
                </div>    
                <div>     
                <select name="subdistrict" id="subdistrict" className='inputMap-subdistrict' 
                value={selectedSubdistrict} 
                onChange={(e) => {
                    const name = e.target.value;
                    setSelectedSubdistrict(name);

                    const found = subdistrict.find((item) => item.Name === name);
                    setSubdistrictId(found ? found.Subdistrict_Id : "");

                    // รีเซ็ต zipcode เดิมเพราะตำบลเปลี่ยนไปแล้ว
                    setZipcode("");
                }}
                >
                    <option value="">ตำบล</option>
                    {subdistrict.map((item) => (
                        <option key={item.Subdistrict_Id} value={item.Name}>{item.Name}</option>
                    ))}
                </select>
                    <input className='inputMap-zipcode' type= "text" placeholder="รหัสไปณี" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                </div> 
                    <input className='inputMap' type= "text" placeholder="ที่อยู่ บ้านเลขที่ ซอย ถนน" value={addressText} onChange={(e) => setAddressText(e.target.value)} />
                <div className='latilong-container'>
             
                </div>
                    <div className='button-container'>

                        <div className='button-container-left'>
                        <button className="ButtonLocation" onClick={handleGetLocation}>แสดงตำแหน่ง</button>
                        <button className="ButtonSaveAddress" onClick={handleUpdateLocation}>บันทึกที่อยู่</button>
                        </div>
                    </div>
                </div>
                


            <div className='MapCon'>
                
                <MapContainer 
                    center={position} 
                    zoom={13} 
                    className="map-container"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {
                    <Marker position={position}>
                        <Popup>
                            You are here!
                        </Popup>
                    </Marker>
                    }
                    <RecenterMap position={position} zoom={zoom} />
                    <LocationMarker onSelect={(newPosition) => setPosition(newPosition)} />
                        <ZoomTracker onZoomChange={setZoom} />
                </MapContainer>
            </div>
        </div></div>
        )
    }