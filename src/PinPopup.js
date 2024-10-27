import React, { useState } from 'react';

function PinPopup({ pin, onSave, onClose, onRemoveDetails }) {
  const [remark, setRemark] = useState(pin.remark);

  const handleSave = () => {
    onSave({ ...pin, remark });
    onClose();
  };

  const handleRemoveDetails = () => {
    // Call the onRemoveDetails function passed down from MapView
    onRemoveDetails(pin.id);
  };

  return (
    <div className="pin-popup">
      <h3>Pin Details</h3>
      <textarea
        placeholder="Enter your remark here..."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      {pin.address && (
        <div>
          <p>Address: {pin.address}</p>
        </div>
      )}
      <button onClick={handleSave}>Save Pin</button>
      <button onClick={handleRemoveDetails}>Remove Details</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default PinPopup;


