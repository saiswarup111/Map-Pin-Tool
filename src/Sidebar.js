import React from 'react';

function Sidebar({ pins, onSelectPin, onRemovePin }) {
  return (
    <div style={{ width: '25vw', height: '100vh', overflowY: 'auto', borderLeft: '1px solid #ddd', padding: '10px' }}>
      <h3>Saved Pins</h3>
      {pins.length > 0 ? (
        pins.map((pin) => (
          <div key={pin.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <p><strong>Remark:</strong> {pin.remark || 'No remark'}</p>
            <p><strong>Address:</strong> {pin.address || 'No address'}</p>
            <button onClick={() => onSelectPin(pin)}>View on Map</button>
            <button onClick={() => onRemovePin(pin.id)}>Remove Pin</button>
          </div>
        ))
      ) : (
        <p>No saved pins.</p>
      )}
    </div>
  );
}

export default Sidebar;


