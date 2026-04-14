import React from 'react';

const OrderFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="order-filters">
      <h3>Filter Orders</h3>
      <div className="filter-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={filters.date}
          onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
        />
      </div>
      <button onClick={() => onFilterChange({ status: '', date: '' })}>Reset Filters</button>
    </div>
  );
};

export default OrderFilters;