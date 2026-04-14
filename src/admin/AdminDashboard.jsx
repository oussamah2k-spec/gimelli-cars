import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
          {/* Add more admin links here as needed */}
        </ul>
      </nav>
      {/* Additional dashboard content can go here */}
    </div>
  );
}

export default AdminDashboard;