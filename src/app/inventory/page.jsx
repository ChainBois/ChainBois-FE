import BorderedButton from "@/components/BorderedButton";
import { Hero } from "@/components/Homepage";
import { BsCaretRightFill } from "react-icons/bs";
import Myweapons from "./components/Myweapons";
import h from "@/components/Homepage/Hero.module.css";

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
              icon={<BsCaretRightFill />}
              borderButtonText={h.heroActionText}
              borderButtonIcon={h.heroActionIcon}
            />
          </>
        }
      />
      <Myweapons />
    </>
  );
}
