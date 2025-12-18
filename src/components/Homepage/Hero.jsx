"use client";

import lockOpened from "@/assets/svg/lockOpened.svg";
import s from "@/styles";
import { cf } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import ConnectWalletButton from "../ConnectWalletButton";
import Button from "./../BorderedButton";
import h from "./Hero.module.css";

export default function Hero({ welcomeText, subText, links }) {
  return (
    <section className={cf(s.wMax, s.flex, s.spaceXBetween, h.hero)}>
      <div
        className={cf(
          s.flex,
          s.spaceXCenter,
          s.spaceYStart,
          s.flex_dColumn,
          h.heroContent,
        )}
      >
        <h1 className={cf(h.heroTitle)}>{welcomeText}</h1>
        <p className={cf(h.heroText)}>{subText}</p>
        <nav
          aria-label="Hero actions"
          className={cf(s.flex, s.flexCenter, h.heroActions)}
        >
          {links}
        </nav>
      </div>
      <div className={cf(s.flex, s.flexEnd, s.p_relative, h.heroCTA)}>
        <ConnectWalletButton />
      </div>
    </section>
  );
}

export const HomePageHero = () => {
  return (
    <Hero
      welcomeText={
        <>
          Where heroes <br />
          become legends
        </>
      }
      subText={
        <>
          ChainBois is a 3rd person shooter P2E game on AVAX <br />
          available on Mobile & PC.
        </>
      }
      links={
        <>
          <Button
            tag={"Request Access"}
            action={() => {}}
            icon={
              <Image src={lockOpened} alt="lock" className={h.heroActionIcon} />
            }
          />
          <Link
            href={"/docs"}
            className={cf(s.flex, s.flexCenter, h.heroAction)}
          >
            <MdInfoOutline className={cf(s.dInlineBlock, h.heroActionIcon)} />
            <span className={cf(s.dInlineBlock, h.heroActionText)}>
              Read Docs
            </span>
          </Link>
        </>
      }
    />
  );
};
