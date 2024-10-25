import React, { useState } from 'react';

function PinPopup({ pin, onSave, onClose }) {
  const [remark, setRemark] = useState(pin.remark);

  const handleSubmit = () => {
    const updatedPin = { ...pin, remark };
    onSave(updatedPin);
    onClose();
  };

  return (
    <div className="pin-popup">
      <h3>Add Remark</h3>
      <textarea value={remark} onChange={(e) => setRemark(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default PinPopup;
