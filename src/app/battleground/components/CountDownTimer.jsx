import React from "react";

export default function CountDownTimer({ countdown }) {
  return (
    <div className="mt-5 grid grid-cols-4 items-center justify-between gap-2">
      <div className="flex flex-col items-center gap-1 rounded-[5px] border border-white/40 bg-neutral-950/60 p-2">
        <span className="font-space-g text-2xl font-bold text-red-600">
          {countdown.days}
        </span>
        <span className="font-space-g text-sm font-semibold text-red-600">
          Days
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 rounded-[5px] border border-white/40 bg-neutral-950/60 p-2">
        <span className="font-space-g text-2xl font-bold text-red-600">
          {countdown.hours}
        </span>
        <span className="font-space-g text-sm font-semibold text-red-600">
          Hours
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 rounded-[5px] border border-white/40 bg-neutral-950/60 p-2">
        <span className="font-space-g text-2xl font-bold text-red-600">
          {countdown.minutes}
        </span>
        <span className="font-space-g text-sm font-semibold text-red-600">
          Minutes
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 rounded-[5px] border border-white/40 bg-neutral-950/60 p-2">
        <span className="font-space-g text-2xl font-bold text-red-600">
          {countdown.seconds}
        </span>
        <span className="font-space-g text-sm font-semibold text-red-600">
          Seconds
        </span>
      </div>
    </div>
  );
}
