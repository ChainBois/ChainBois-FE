import React from "react";
import InventoryHero from "./components/InventoryHero";
import Myweapons from "./components/Myweapons";
import BorderedButton from "@/components/BorderedButton";
import { BsCaretRightFill } from "react-icons/bs";
import s from "@/styles";
import { Hero } from "@/components/Homepage";
import { cf } from "@/utils";

export default function InventoryPage() {
  return (
    <>
      <Hero
        welcomeText={
          <>
            Welcome to the <br /> Inventory
          </>
        }
        subText={
          <>
            Your complete collection of weapons, armor, and rewards.
            <br />
            Sell your weapons
          </>
        }
        links={
          <>
            <BorderedButton
              tag={"View Marketplace"}
              isLink={true}
              action={"#marketplace"}
              icon={<BsCaretRightFill className={cf(s.dInlineBlock)} />}
            />
          </>
        }
      />
      <Myweapons />
    </>
  );
}
