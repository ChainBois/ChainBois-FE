"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { leaderboardData } from "./data";
import CountDownTimer from "./CountDownTimer";

const TournamentCard = ({ className, data }) => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetDate, setTargetDate] = useState(new Date(data.date));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-4xl border border-neutral-200 bg-[#181818] p-6 md:grid md:grid-cols-2 md:gap-6 lg:gap-10 lg:p-10">
      <div className="">
        <span className="text-sm text-red-600">Ongoing</span>
        <h3 className="font-space-g my-2 text-2xl font-bold text-white">
          {data.title}
        </h3>
        <span className="text-lg font-semibold text-red-600">200 $somi</span>
        <p className="mt-7 text-base leading-normal text-white">
          {open
            ? "A brief description of the tournament goes here; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae velit pellentesque, euismod justo at, volutpat augue. Aliquam rhoncus tincidunt blandit. Morbi dictum mattis pretium. Mauris justo metus, faucibus nec purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            : " A brief description of the tournament goes here; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae velit pellentesque, euismod justo at, volutpat augue. Aliquam rhoncus tincidunt blandit. Morbi dictum mattis pretium. Mauris justo metus, faucibus nec purus"}

          <span
            className="ml-1 cursor-pointer text-red-600"
            onClick={() => setOpen(!open)}
          >
            {open ? "See Less" : "See More"}{" "}
          </span>
        </p>

        {/* COUNTDOWN TIMER */}
        <CountDownTimer countdown={countdown} />

        <div className="mt-5 flex gap-3">
          <button className="inline-flex aspect-4/1 cursor-pointer items-center justify-center border border-red-600 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">
            Leaderboard
          </button>
          <button className="text-shadow-2xl inline-flex aspect-4/1 cursor-pointer items-center justify-center border bg-neutral-400 px-5 py-2.5 text-sm font-semibold text-white">
            Details
          </button>
        </div>
      </div>

      <div className="mt-7">
        <h3 className="font-space-g mb-2.5 text-2xl font-bold text-white">
          Leaderboard
        </h3>
        <ScrollArea className="h-100 rounded-[10px] border border-white/20 bg-black">
          <div className="flex flex-col gap-2.5 rounded-[10px] bg-black p-4">
            {leaderboardData
              .sort((a, b) => b.points - a.points)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between overflow-hidden rounded-[5px] border border-red-600 pr-2 pl-0"
                >
                  <span className="font-space-g -translate-x-1 text-3xl font-bold text-white/50 md:text-6xl">
                    {index + 1 < 10 && 0}
                    {index + 1}
                  </span>
                  <span className="font-space-g font-semibold text-white md:text-2xl">
                    {item.name}
                  </span>
                  <span className="font-space-g text-sm font-semibold text-red-600">
                    {item.points} points
                  </span>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TournamentCard;
