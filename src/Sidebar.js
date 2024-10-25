import React from 'react';

function Sidebar({ pins, onSelectPin }) {
  return (
    <div className="sidebar">
      <h3>Saved Pins</h3>
      <ul>
        {pins.map(pin => (
          <li key={pin.id} onClick={() => onSelectPin(pin)} style={{ cursor: 'pointer' }}>
            <strong>Remark:</strong> {pin.remark || 'No remarks'}
            <br />
            <strong>Address:</strong> {pin.address || 'Address not available'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
