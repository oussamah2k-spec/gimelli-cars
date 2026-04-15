import { memo } from 'react';

function AppScreenLoader() {
  return (
    <div className="session-loader-screen">
      <div className="session-loader-card panel">
        <div className="grid w-full gap-4" aria-hidden="true">
          <div className="h-5 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-28 rounded-[20px] bg-white/5 animate-pulse" />
          <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" />
          <div className="h-4 w-5/6 rounded-full bg-white/10 animate-pulse" />
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default memo(AppScreenLoader);