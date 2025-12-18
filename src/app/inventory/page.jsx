import React from "react";
import InventoryHero from "./components/InventoryHero";
import Myweapons from "./components/Myweapons";
import BorderedButton from "@/components/BorderedButton";
import { BsCaretRightFill } from "react-icons/bs";
import s from "@/styles";
import { Hero } from "@/components/Homepage";
import { cf } from "@/utils";

/**
 * Render the Inventory page containing a hero section and the user's weapons list.
 * @returns {JSX.Element} The Inventory page element with a Hero and Myweapons components.
 */
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