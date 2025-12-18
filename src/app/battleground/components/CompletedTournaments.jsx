"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function CompletedTournaments() {
  return (
    <section className="overflow-x-hidden">
      <div className="container mx-auto p-4">
        <div className="relative mb-7 flex items-center justify-between">
          <h2 className="font-space-g mb-3 text-2xl font-bold whitespace-nowrap text-white">
            Completed Tournaments
          </h2>

          <hr className="w-full translate-x-5 border-0 border-t border-white p-0" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-10">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[30px] bg-linear-to-b from-neutral-900 to-black p-6 outline-1 -outline-offset-1 outline-white/50 md:p-6!"
            >
              <div className="mb-10 flex flex-col items-center justify-center">
                <span className="text-sm text-red-600">Completed</span>
                <h3 className="my-0.5 text-2xl font-bold text-white">
                  Tournament #005
                </h3>
                <p className="text-lg font-semibold text-red-600">
                  Oops, you have no reward.
                </p>
              </div>

              <div className="mx-auto grid w-10/12 grid-cols-3 items-end gap-x-8">
                {[3, 2, 1].map((pos, i) => (
                  <div key={i} className="flex w-full flex-col items-center">
                    <Image
                      src="/img/avatar.png"
                      alt="avatar"
                      width={200}
                      height={200}
                      className="size-14 object-cover object-center"
                    />
                    <h3 className="mt-1 mb-2 font-medium text-white">
                      Thechain......i
                    </h3>
                    <div
                      className={cn(
                        "flex w-full items-center justify-center bg-linear-to-b from-red-600 to-black",
                        i === 0 && "h-75",
                        i === 1 && "h-96",
                        i === 2 && "h-100",
                      )}
                    >
                      <span className="font-space-g translate-y-3 scale-125 text-6xl font-black text-neutral-300">
                        {pos}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
