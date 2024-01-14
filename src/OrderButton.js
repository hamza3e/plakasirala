// OrderButton.js
import React from "react";

const OrderButton = ({ data, onOrderButtonClick }) => {
  return (
    <div>
      <button onClick={() => onOrderButtonClick(data)}>Yeniden Sırala</button>
    </div>
  );
};

export default OrderButton;
