"use client";
import React from "react";
import TournamentMobileCarousel from "./components/TournamentMobileCarousel";
import TournamentCard from "./components/TournamentCard";
import BattleHero from "./components/BattleHero";
import Collections from "./components/Collections";
import UpcomingTournaments from "./components/UpcomingTournaments";
import CompletedTournaments from "./components/CompletedTournaments";
import { Hero } from "@/components/Homepage";
import BorderedButton from "@/components/BorderedButton";
import { BsCaretRightFill } from "react-icons/bs";
import s from "@/styles";
import { cf } from "@/utils";

export default function BattlegroundPage() {
  return (
    <>
      <Hero
        welcomeText={
          <>
            Welcome to the <br /> Battleground
          </>
        }
        subText={
          <>
            Compete in live tournaments and climb the leaderboard.
            <br />
            Earn $BATTLE, climb the ranks.
          </>
        }
        links={
          <>
            <BorderedButton
              tag={"View Training Room"}
              isLink={true}
              action={"#training-room"}
              icon={<BsCaretRightFill className={cf(s.dInlineBlock)} />}
            />
          </>
        }
      />
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
