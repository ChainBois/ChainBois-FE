"use client";

import Ruins from "@/assets/img/Ruins.png";
import s from "@/styles";
import { cf } from "@/utils";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsCaretRightFill } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa6";
import { HiOutlineTrophy } from "react-icons/hi2";
import BorderedButton from "../BorderedButton";
import "./TournamentCard.module.css";
import t from "./TournamentCard.module.css";

function TournamentStat({ tag, value, icon }) {
  return (
    <div
      className={cf(
        s.flex,
        s.spaceXStart,
        s.spaceYStart,
        s.flex_dColumn,
        t.card__stat,
      )}
    >
      <span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__tag)}>
        {tag}
      </span>
      <div
        className={cf(
          s.flex,
          s.flexStart,
          s.dInlineBlock,
          t.card__stat__inner__wrapper,
        )}
      >
        <span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__icon)}>
          {icon}
        </span>
        <span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__value)}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default function TournamentCard() {
  const circle = useRef(null);
  const [progress, setProgress] = useState(0);
  const [targetProgress] = useState(65);

  const circlePercent = useCallback(() => {
    if (!circle) return;
    const circumference = Math.PI * (103 - 18);
    let change = circumference - (circumference * progress) / 100;
    circle.current.style.strokeDashoffset = change;
  }, [progress]);

  const changePercent = useCallback(
    function () {
      if (progress > 100) {
        setProgress(() => 0);
      } else {
        circlePercent();
        // setProgress(() => 0)
      }
    },
    [progress, circlePercent],
  );

  useEffect(() => {
    changePercent();
  }, [changePercent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <article className={cf(s.flex, s.flexCenter, t.tournamentCard)}>
      <div
        className={cf(
          s.wMax,
          s.hMax,
          s.flex,
          s.spaceXEnd,
          s.spaceYStart,
          s.p_relative,
          t.card__container,
        )}
      >
        <Image src={Ruins} alt="Ruins" className={t.card__img} />
        <div className={cf(t.card__percent)}>
          <svg className={cf(t.svg)}>
            <defs>
              <radialGradient
                id="gradient"
                cx="50%"
                cy="50%"
                r="60%"
                fx="50%"
                fy="50%"
              >
                <stop offset="30%" stopColor="var(--primary-dark)" />
                <stop offset="100%" stopColor="var(--primary-light)" />
              </radialGradient>
            </defs>
            <circle
              cx="51.5"
              cy="51.5"
              r="42.5"
              stroke="url(#gradient)"
              id="circle"
              ref={circle}
              className={cf(t.circle)}
            ></circle>
          </svg>
          <div
            className={cf(s.flex, s.flex_dColumn, s.flexStart, t.card__number)}
          >
            <span className={cf(s.wMax, s.tCenter, s.dInlineBlock, t.progress)}>
              {progress}
            </span>
            <span className={cf(s.wMax, s.tCenter, s.dInlineBlock, t.days)}>
              Day{progress !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div
          className={cf(s.flex, s.flexStart, s.p_relative, t.tournamentInfo)}
        >
          <h3 className={cf(t.tournamentTitle)}>Survival Battle</h3>
          <p className={cf(t.tournamentLore)}>
            The point of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using.
          </p>
          <BorderedButton
            tag={"Join Tournament"}
            icon={<BsCaretRightFill className={cf(t.playIcon)} />}
            isLink={false}
            action={() => {}}
            borderButton={cf(t.borderButton)}
            borderButtonContent={cf(t.borderButtonContent)}
            borderButtonText={cf(t.borderButtonText)}
            borderButtonIcon={cf(t.borderButtonIcon)}
            type={"button"}
          />
        </div>

        <footer className={cf(s.flex, s.flexStart, t.tournamentMeta)}>
          <TournamentStat
            tag={"Competition Status"}
            value={"Active"}
            icon={<div className={cf(t.statusIndicator)}></div>}
          />
          <TournamentStat
            tag={"Prize Pool"}
            value={"203,020 Ꝑ"}
            icon={<HiOutlineTrophy className={cf(t.trophy)} />}
          />
          <TournamentStat
            tag={"Submission Due  Date"}
            value={
              <time dateTime="2023-06-23T12:00:00">23rd June, 12:00 CAT</time>
            }
            icon={<FaRegFlag className={cf(t.flag)} />}
          />
        </footer>
      </div>
    </article>
  );
}
