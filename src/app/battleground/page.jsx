"use client";
import BorderedButton from "@/components/BorderedButton";
import { Hero } from "@/components/Homepage";
import { BsCaretRightFill } from "react-icons/bs";
import Collections from "./components/Collections";
import CompletedTournaments from "./components/CompletedTournaments";
import UpcomingTournaments from "./components/UpcomingTournaments";
import h from "@/components/Homepage/Hero.module.css";

/**
 * Display the Battleground page with a header and tournament sections.
 *
 * Renders a Hero header (welcome text, subtext, and a training-room link button) followed by Collections, UpcomingTournaments, and CompletedTournaments sections.
 * @returns {JSX.Element} The Battleground page component.
 */
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
              icon={<BsCaretRightFill />}
              borderButtonText={h.heroActionText}
              borderButtonIcon={h.heroActionIcon}
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
