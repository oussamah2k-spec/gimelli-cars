import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getStockClass(stock) {
  if ((stock || '').toString().trim().toLowerCase() === 'not available') {
    return 'is-empty';
  }

  return 'is-good';
}

function CarTable({ cars, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>
                <img className="admin-table__thumb" src={car.imageUrl} alt={car.name} />
              </td>
              <td>
                <div className="admin-car-meta">
                  <strong>{car.name}</strong>
                  <span>{car.description || 'No description provided.'}</span>
                </div>
              </td>
              <td>
                <div className="admin-price-stack">
                  <strong>{formatMoney(car.price)}</strong>
                  <span>{car.oldPrice ? `Was ${formatMoney(car.oldPrice)}` : 'No previous price'}</span>
                </div>
              </td>
              <td>{car.type}</td>
              <td>
                <span className={`admin-stock-badge ${getStockClass(car.stock)}`}>{car.stock}</span>
              </td>
              <td>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => onEdit(car)}>
                    <Pencil size={15} />
                    <span>Edit</span>
                  </button>
                  <button type="button" className="is-danger" onClick={() => onDelete(car.id)}>
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cars.length === 0 ? <p className="admin-empty-state">No cars found in Firestore yet.</p> : null}
    </div>
  );
}

export default CarTable;