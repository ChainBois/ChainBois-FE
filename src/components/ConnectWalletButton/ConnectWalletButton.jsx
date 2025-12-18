"use client";

import {
  ConnectButton,
  darkTheme,
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { somniaTestnet } from "thirdweb/chains";
import { thirdwebClient } from "@/lib";
import s from "@/styles";
import c from "./ConnectWalletButton.module.css";
import { cf } from "@/utils";

const wallets = [
  // inAppWallet(), // email/social login (optional)
  createWallet("io.metamask"),
  createWallet("app.keplr"),
  createWallet("app.phantom"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
  // createWallet('com.safepal'),
];

const StandIn = () => {
  return (
    <span className={cf(s.wMax, s.flex, s.flexCenter, s.p_absolute, c.standIn)}>
      <span className={cf(s.flex, c.standInDot, c.notConnected)}></span>

      <span className={cf(s.wMax, s.tLeft, c.standInTitle)}>
        Connect Wallet
      </span>

      <span className={cf(s.wMax, s.tLeft, c.standInText)}>
        Securely link your wallet to get started
      </span>

      <span className={cf(s.wMax, s.tLeft, c.standInFooterText)}>Connect</span>
    </span>
  );
};

const DetailsStandIn = () => {
  const activeAccount = useActiveAccount();
  const { data, isLoading, isError } = useWalletBalance({
    chain: somniaTestnet,
    address: activeAccount?.address,
    client: thirdwebClient,
  });

  return (
    <span className={cf(s.wMax, s.flex, s.flexCenter, s.p_absolute, c.standIn)}>
      <span className={cf(s.flex, c.standInDot, c.connected)}></span>

      <span className={cf(s.wMax, s.tLeft, c.standInTitle)}>
        {isLoading ? "Loading..." : isError ? "Error" : data?.displayValue}
      </span>
      <span className={cf(s.wMax, s.tLeft, c.standInText)}>
        Your wallet balance
      </span>

      <span className={cf(s.wMax, s.tLeft, c.standInFooterText)}>
        View Details
      </span>
    </span>
  );
};

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      chain={somniaTestnet} // explicit, in addition to ChainProvider default
      theme={darkTheme({
        colors: {},
      })}
      connectButton={{
        label: <StandIn />,
      }}
      detailsButton={{
        className: c.detailsButton,
      }}
      connectModal={{
        title: "Sign in to Chainbois",
        titleIcon: "https://chain-bois.vercel.app/img/CB.svg",
        size: "compact",
      }}
      connectedAccountAvatarUrl={"https://chain-bois.vercel.app/img/CB.svg"}
    />
  );
}
