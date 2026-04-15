import { memo } from 'react';

function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="status-card" role="status">
      <div className="grid w-full max-w-md gap-3" aria-hidden="true">
        <div className="mx-auto h-5 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="h-24 rounded-[18px] bg-white/5 animate-pulse" />
        <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-4/5 rounded-full bg-white/10 animate-pulse" />
      </div>
      <p>{label}</p>
    </div>
  );
}

export default memo(LoadingState);