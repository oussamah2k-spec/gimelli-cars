import React from 'react';
import PropTypes from 'prop-types';

const OrderStatusPanel = ({ status }) => {
  const statusStyles = {
    pending: { backgroundColor: 'orange', color: 'white' },
    confirmed: { backgroundColor: 'green', color: 'white' },
    cancelled: { backgroundColor: 'red', color: 'white' },
  };

  return (
    <div style={{ ...statusStyles[status], padding: '10px', borderRadius: '5px' }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

OrderStatusPanel.propTypes = {
  status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled']).isRequired,
};

export default OrderStatusPanel;