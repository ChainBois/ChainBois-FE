"use client";
import BorderedButton from "@/components/BorderedButton";
import { Hero } from "@/components/Homepage";
import { BsCaretRightFill } from "react-icons/bs";
import Collections from "./components/Collections";
import CompletedTournaments from "./components/CompletedTournaments";
import UpcomingTournaments from "./components/UpcomingTournaments";

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
