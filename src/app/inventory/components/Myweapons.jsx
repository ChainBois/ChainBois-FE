"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

export default function Myweapons() {
  const [activeTab, setActiveTab] = useState("assault_rifles");

  return (
    <section>
      <div className="container mx-auto p-4">
        <div className="relative mb-7 flex items-center justify-between">
          <h2 className="font-space-g mb-3 text-2xl font-bold whitespace-nowrap text-white">
            My Weapons
          </h2>

          <hr className="w-full translate-x-5 border-0 border-t border-white p-0" />
        </div>

        <div>
          {/* TABS */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-6">
              {weaponCategories.map((weapon) => (
                <button
                  key={weapon.value}
                  className={cn("border-none outline-none focus:border-0")}
                  onClick={() => setActiveTab(weapon.value)}
                >
                  <div
                    className={cn(
                      "block h-0.5 w-full bg-linear-90 from-transparent via-red-600 to-transparent duration-300",
                      activeTab === weapon.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap text-white",
                      activeTab === weapon.value && "text-red-600",
                    )}
                  >
                    {weapon.label}
                  </span>
                  <div
                    className={cn(
                      "block h-0.5 w-full bg-linear-90 from-transparent via-red-600 to-transparent",
                      activeTab === weapon.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INVENTORIES */}
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="overflow-hidden border border-red-600">
                <Image
                  src="/inventory/ar-47.jpg"
                  alt="AR-47 Temptest"
                  width={400}
                  height={400}
                  className="w-full object-cover object-center"
                />

                <div className="p-4 md:p-6 lg:p-8">
                  <h3 className="font-space-g mb-1 text-2xl font-bold text-white">
                    AR-47 “Tempest”
                  </h3>
                  <p className="text-base text-white">
                    Balanced rifle with storm-burst recoil pattern.
                  </p>
                  <button className="block cursor-pointer border-none bg-transparent outline-none focus-within:outline-none focus-visible:outline-none">
                    <div className="mt-6 rounded-xs border border-white/20 p-1">
                      <div className="inline-flex w-max items-center justify-center rounded-xs bg-red-600 px-4 py-3 text-white">
                        Sell
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const weaponCategories = [
  { label: "Assault Rifles", value: "assault_rifles" },
  { label: "SMGs", value: "smgs" },
  { label: "LMGs", value: "lmgs" },
  { label: "Marksman Rifles", value: "marksman_rifles" },
  { label: "Handguns", value: "handguns" },
  { label: "Launchers", value: "launchers" },
  { label: "Melee", value: "melee" },
];
