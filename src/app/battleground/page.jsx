"use client";
import React from "react";
import TournamentMobileCarousel from "./components/TournamentMobileCarousel";
import TournamentCard from "./components/TournamentCard";
import BattleHero from "./components/BattleHero";
import Collections from "./components/Collections";
import UpcomingTournaments from "./components/UpcomingTournaments";
import CompletedTournaments from "./components/CompletedTournaments";

export default function BattlegroundPage() {
  return (
    <>
      <BattleHero />
      <Collections />
      <UpcomingTournaments />
      <CompletedTournaments />
    </>
  );
}

// style={{
//   clipPath: "polygon(20% 0%, 100% 0%, 100% 70%, 0% 70%, 0% 35%)",
//   // height: "200px",
//   // width: "160px",
// }}
