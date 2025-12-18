import BorderedButton from "@/components/BorderedButton";
import { Hero } from "@/components/Homepage";
import { BsCaretRightFill } from "react-icons/bs";
import Myweapons from "./components/Myweapons";

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
            />
          </>
        }
      />
      <Myweapons />
    </>
  );
}
