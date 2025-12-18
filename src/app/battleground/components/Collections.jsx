import React from "react";
import TournamentMobileCarousel from "./TournamentMobileCarousel";
import TournamentCard from "../components/TournamentCard";
import { tournamentsData } from "./data";

export default function Collections() {
  return (
    <section className="overflow-x-hidden">
      <div className="container mx-auto p-4">
        <div className="relative mb-7 flex items-center justify-between">
          <h2 className="font-space-g mb-3 text-2xl font-bold whitespace-nowrap text-white">
            Your ChainBois Collection
          </h2>

          <hr className="w-full translate-x-5 border-0 border-t border-white p-0" />
        </div>

        {/* TOURNAMENT CAROUSEL FOR MOBILE */}
        <TournamentMobileCarousel />

        {/* TOURNAMENT  FOR DESKTOP */}
        <div className="hidden md:flex md:flex-col md:gap-6">
          {tournamentsData.map((tournament) => (
            <TournamentCard key={tournament.id} data={tournament} />
          ))}
        </div>
      </div>
    </section>
  );
}
