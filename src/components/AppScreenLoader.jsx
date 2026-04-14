import React from 'react';

function AppScreenLoader() {
  return (
    <div className="session-loader-screen">
      <div className="session-loader-card panel">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Loading secure admin session...</p>
      </div>
    </div>
  );
}

export default AppScreenLoader;