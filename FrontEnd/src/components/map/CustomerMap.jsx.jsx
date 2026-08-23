import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import './CustomerMap.css';


function RecenterMap({ position }) {
    const map = useMap();

    useEffect(() => {

        map.setView(position, 13);
    }, [position, map]);

    return null;
}


    function LocationMarker({ onSelect }) {
    useMapEvents({
        click: (e) => {
            // TODO 5: ดึง lat, lng จาก e.latlng
            // แล้วเรียก onSelect โดยส่ง array [lat, lng] เข้าไป
            const { lat, lng } = e.latlng;
            onSelect([lat, lng]);
        }
    });

    return null; // component นี้ไม่ต้อง render อะไรเหมือนกัน แค่ดักฟัง event
}


// ประกาศนอก CustomerMap เหมือน component อื่น ๆ
function ZoomTracker({ onZoomChange }) {
    const map = useMapEvents({
        zoomend: () => {

            const currentZoom = map.getZoom();
            onZoomChange(currentZoom);
        }
    });

    return null;
}


export default function CustomerMap() {
    const [position, setPosition] = useState([13.7563, 100.5018]);
    const [zoom, setZoom] = useState(13);

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






    return (
        <div className="CustomerMap">
            <h1>Map</h1>

            <button className="ButtonLocation" onClick={handleGetLocation}>Get My Location</button>
                            <p>Current Zoom: {zoom}</p>
                            <p>Current Position: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>

        <div style={{ position: 'relative', height: '500px', width: '500px' }}>
            
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, fontSize: '24px' }}>
                N
            </div>
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
                <RecenterMap position={position} />
                <LocationMarker onSelect={(newPosition) => setPosition(newPosition)} />
                    <ZoomTracker onZoomChange={setZoom} />
            </MapContainer>
        </div>
    </div>
    )
}