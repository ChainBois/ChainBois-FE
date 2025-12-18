"use client";

import CB from "@/assets/svg/CB.svg";
import CBBranding from "@/assets/svg/CBBranding.svg";
import { isEqual, useMain } from "@/hooks";
import s from "@/styles";
import { cf } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdArrowOutward } from "react-icons/md";
import n from "./Navbar.module.css";

function NavItem({
  tag = "Home",
  action = null,
  isLink = true,
  showTooltip = true,
  tooltipText = "Coming Soon",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const Responder = memo(
    ({ action, tag, style, onMouseEnter, onMouseLeave }) =>
      isLink ? (
        <>
          {action ? (
            <Link
              href={action}
              className={style}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {tag}
            </Link>
          ) : (
            <span
              className={style}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {tag}
            </span>
          )}
        </>
      ) : (
        <button
          onClick={action}
          className={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {tag}
        </button>
      ),
    (prev, next) => isEqual(prev, next),
  );

  const handleMouseEnter = () => {
    if (showTooltip) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <li className={cf(s.flex, s.flexCenter, s.p_relative, n.navItemWrapper)}>
      <Responder
        action={action}
        tag={tag}
        style={n.navItem}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {showTooltip && (
        <div
          className={cf(n.tooltip, isHovered && n.fadeIn)}
          style={{
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? "auto" : "none",
          }}
        >
          <span className={n.tooltip__text}>{tooltipText}</span>
        </div>
      )}
    </li>
  );
}

function PlayButton() {
  return (
    <button
      className={cf(s.flex, s.flexCenter, s.g10, n.playButton)}
      onClick={() => {}}
    >
      <span className={s.dInlineBlock}>Play Now</span>
      <MdArrowOutward className={cf(s.dInlineBlock, n.playIcon)} />
    </button>
  );
}

export default function Navbar() {
  const { isSmall } = useMain();
  const branding = useMemo(() => (isSmall ? CB : CBBranding), [isSmall]);
  return (
    <header className={cf(s.wMax, s.flex, s.flexCenter, n.nav)}>
      <nav
        className={cf(
          s.wMax,
          s.flex,
          s.spaceXBetween,
          s.spaceYCenter,
          n.navItems,
        )}
      >
        <Link href={"/"} className={cf(s.flex, s.flexCenter, n.logoContainer)}>
          <Image
            src={branding}
            alt="CBBranding Logo"
            width={240}
            height={32.8}
            className={n.logo}
          />
        </Link>

        <div className={cf(s.flex, s.flexCenter, n.navLinksWrapper)}>
          <ul className={cf(s.flex, s.flexCenter, n.navLinks)}>
            <NavItem
              tag="Battleground"
              action={"/battleground"}
              showTooltip={false}
            />
            <NavItem
              tag="Inventory"
              action={"/inventory"}
              showTooltip={false}
            />
            <NavItem
              tag="Training Room"
              showTooltip={true}
            />
            <NavItem
              tag="Marketplace"
              showTooltip={true}
            />
            <NavItem
              tag="Merch"
              showTooltip={true}
            />
          </ul>

          <PlayButton />
        </div>

        <button className={cf(s.flex, s.flexCenter, n.hamburgerWrapper)}>
          <GiHamburgerMenu className={n.hamburger} />
        </button>
      </nav>
    </header>
  );
}
