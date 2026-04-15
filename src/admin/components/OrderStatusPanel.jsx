import React from 'react';
import PropTypes from 'prop-types';

const OrderStatusPanel = ({ status }) => {
  const statusStyles = {
    pending: {
      backgroundColor: 'rgba(212, 175, 55, 0.12)',
      color: '#F5D97A',
      border: '1px solid rgba(212, 175, 55, 0.28)',
    },
    confirmed: {
      backgroundColor: 'rgba(245, 217, 122, 0.12)',
      color: '#FFFFFF',
      border: '1px solid rgba(245, 217, 122, 0.28)',
    },
    cancelled: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: '#F5D97A',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
  };

  return (
    <div style={{ ...statusStyles[status], padding: '10px', borderRadius: '10px' }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

OrderStatusPanel.propTypes = {
  status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled']).isRequired,
};

export default OrderStatusPanel;