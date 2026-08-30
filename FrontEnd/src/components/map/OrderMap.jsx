    import 'leaflet/dist/leaflet.css';
    import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
    import { useState, useEffect } from 'react';
    import './OrderMap.css';


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


    export default function OrderMap({selectedPosition }) {
        const [position, setPosition] = useState([13.7563, 100.5018]);
        const [defaultPosition] = useState([13.7563, 100.5018]);
        const [zoom, setZoom] = useState(13);

    /*-----------------------------------------------*/

useEffect(() => {

  if (selectedPosition) {
  setPosition(selectedPosition)
  setZoom(16) 
}
  else{
    setPosition(defaultPosition)
    setZoom(13)
  }
}, [selectedPosition]);


        return (
            <div>
            <div className="OrderMap">
              <p>test</p>


            <div className=''>
                
                <MapContainer 
                    center={position} 
                    zoom={13} 
                    className="MapOrderCon"
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