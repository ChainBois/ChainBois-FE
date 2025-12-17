import React from "react";

export default function InventoryHero() {
  return (
    <section className="py-12">
      <div className="container mx-auto p-4">
        <div className="lg:w-6/12">
          <h1 className="font-space-g mb-6! text-4xl font-bold text-white xl:text-8xl">
            Welcome to the inventory
          </h1>
          <p className="text-white">
            Your complete collection of weapons, armor, and rewards. Sell your
            weapons
          </p>

          <button className="block cursor-pointer border-none bg-transparent outline-none focus-within:outline-none focus-visible:outline-none">
            <div className="mt-8! rounded-xs border border-white/20 p-1">
              <div className="inline-flex w-max items-center justify-center rounded-xs bg-red-600 px-4 py-3 text-white">
                View Tournament
              </div>
            </div>
          </button>
        </div>

        <div className="inline-flex w-full items-center justify-end gap-1.5">
          <div className="inline-flex h-44 w-96 flex-col items-end justify-start gap-1.5 rounded-md bg-neutral-900 pt-2 pr-2.5 pb-5 pl-6">
            <div className="h-1.5 w-1.5 rounded-[3px] bg-red-600" />
            <div className="flex flex-col items-start justify-start gap-7 self-stretch">
              <div className="flex flex-col items-start justify-start gap-1.25 self-stretch">
                <div className="font-inter justify-center text-2xl leading-7 font-medium text-white">
                  4,200 $battle
                </div>
                <div className="font-inter justify-center text-sm leading-4 font-normal text-neutral-500">
                  This is your $battle balance
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-1.25 self-stretch">
                <div className="font-inter justify-center text-2xl leading-7 font-medium text-white">
                  1,100 Points
                </div>
                <div className="font-inter justify-center text-sm leading-4 font-normal text-neutral-500">
                  This is your points balance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
