"use client";
import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import TournamentCard from "./TournamentCard";
import { tournamentsData } from "./data";

const TournamentMobileCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tournaments, setTournaments] = useState(tournamentsData);

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + tournaments.length) % tournaments.length,
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tournaments.length);
  };

  return (
    <div className="w-full md:hidden">
      <div className="relative w-full overflow-hidden">
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="w-full shrink-0 grow-0 basis-full"
            >
              <TournamentCard className="w-full" data={tournament} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <button
          className="inline-flex size-14 items-center justify-center rounded-full border border-red-600 bg-red-600/20 text-white"
          onClick={handlePrevious}
        >
          <BsArrowLeft size={24} />
        </button>
        <span className="font-space-g font-bold text-white">
          {currentIndex + 1} of {tournaments.length}
        </span>
        <button
          className="inline-flex size-14 items-center justify-center rounded-full border border-red-600 bg-red-600/20 text-white"
          onClick={handleNext}
        >
          <BsArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TournamentMobileCarousel;
