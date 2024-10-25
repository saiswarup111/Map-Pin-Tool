import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import PinPopup from './PinPopup';
import Sidebar from './Sidebar';

// Define custom icon styles for highlighted and regular markers
const defaultIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  iconSize: [24, 36]
});

const highlightedIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [30, 45]
});

function MapView() {
  const [pins, setPins] = useState(JSON.parse(localStorage.getItem('pins')) || []);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  const handleMapClick = async (e) => {
    const newPin = {
      id: Date.now(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      remark: '',
      address: ''
    };

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: e.latlng.lat,
          lon: e.latlng.lng,
          format: 'json'
        }
      });
      newPin.address = response.data.display_name;
    } catch (error) {
      console.error("Error fetching address:", error);
    }

    setSelectedPin(newPin);  // Open the remark form
  };

  const savePin = (pin) => {
    setPins([...pins, pin]);
    setSelectedPin(null);
  };

  const handlePinSelect = (pin) => {
    setSelectedPinId(pin.id);  // Set the pin as selected
    const map = mapRef.current;
    if (map) {
      map.setView([pin.lat, pin.lng], map.getZoom(), { animate: true });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh", width: "75vw" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {pins.map(pin => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={pin.id === selectedPinId ? highlightedIcon : defaultIcon}  // Highlight selected pin
          />
        ))}
        <MapClickHandler onClick={handleMapClick} />
      </MapContainer>

      <Sidebar pins={pins} onSelectPin={handlePinSelect} />

      {selectedPin && (
        <PinPopup pin={selectedPin} onSave={savePin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e);
    }
  });
  return null;
}

export default MapView;

