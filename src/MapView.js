import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import PinPopup from './PinPopup';
import Sidebar from './Sidebar';

function MapView() {
  const [pins, setPins] = useState(JSON.parse(localStorage.getItem('pins')) || []);
  const [selectedPin, setSelectedPin] = useState(null);
  const mapRef = useRef(); // Ref to access the map instance

  // Define icons for regular and selected pins
  const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  const highlightedIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', // Use a different icon or custom image for highlighting
    iconSize: [30, 50],
    iconAnchor: [15, 50]
  });

  // Save pins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  // Function to handle clicks on the map and create a new pin
  const handleMapClick = async (e) => {
    const newPin = {
      id: Date.now(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      remark: '',
      address: ''
    };

    // Fetch address using Nominatim API (optional)
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

  // Save the pin details with remarks and address
  const savePin = (updatedPin) => {
    setPins((prevPins) => {
      const pinIndex = prevPins.findIndex(pin => pin.id === updatedPin.id);
      if (pinIndex !== -1) {
        prevPins[pinIndex] = updatedPin;
      } else {
        prevPins.push(updatedPin);
      }
      return [...prevPins];
    });
    setSelectedPin(null);
  };

  // Function to remove a pin by ID
  const removePin = (pinId) => {
    setPins((prevPins) => prevPins.filter(pin => pin.id !== pinId));
  };

  // Function to select a pin and focus on it
  const selectPin = (pin) => {
    setSelectedPin(pin);

    if (mapRef.current) {
      mapRef.current.setView([pin.lat, pin.lng], 13); // Center the map on the selected pin
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh", width: "75vw" }}
        ref={mapRef} // Attach the map reference here
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {pins.map(pin => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={pin.id === selectedPin?.id ? highlightedIcon : defaultIcon} // Highlight the selected pin
            eventHandlers={{
              click: () => setSelectedPin(pin) // Select pin when marker is clicked
            }}
          />
        ))}
        <MapClickHandler onClick={handleMapClick} />
      </MapContainer>

      <Sidebar
        pins={pins}
        onSelectPin={selectPin} // Pass selectPin function to Sidebar
        onRemovePin={removePin}  // Pass the removePin function to Sidebar
      />

      {selectedPin && (
        <PinPopup
          pin={selectedPin}
          onSave={savePin}
          onClose={() => setSelectedPin(null)}
          onRemoveDetails={(pinId) => savePin({ ...selectedPin, address: '', remark: '' })}
        />
      )}
    </div>
  );
}

// Component to handle map clicks
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e);
    }
  });
  return null;
}

export default MapView;

