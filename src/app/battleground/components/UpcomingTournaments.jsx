import React from "react";
import CountDownTimer from "./CountDownTimer";

export default function UpcomingTournaments() {
  return (
    <section className="overflow-x-hidden">
      <div className="container mx-auto p-4">
        <div className="relative mb-7 flex items-center justify-between">
          <h2 className="font-space-g mb-3 text-2xl font-bold whitespace-nowrap text-white">
            Upcoming Tournaments
          </h2>

          <hr className="w-full translate-x-5 border-0 border-t border-white p-0" />
        </div>

        <div>
          <div className="relative self-stretch overflow-hidden rounded-2xl bg-neutral-900 p-4 shadow-[inset_0px_0px_29.196426391601562px_0px_rgba(236,27,36,0.75)] outline outline-offset-[-0.97px] outline-white/40 md:p-6 lg:p-8">
            <div className="mb-10 flex flex-col items-center justify-center">
              <span className="text-sm text-red-600">Completed</span>
              <h3 className="my-0.5 text-2xl font-bold text-white">
                Tournament #005
              </h3>
              <p className="text-lg font-semibold text-red-600">
                Oops, you have no reward.
              </p>
            </div>

            <CountDownTimer
              countdown={{ days: 0, hours: 0, minutes: 0, seconds: 0 }}
            />

            <p className="font-space-g mt-5 leading-normal text-white">
              A brief description of the tournament goes here; Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Aenean vitae velit
              pellentesque, euismod justo at, volutpat augue. Aliquam rhoncus
              tincidunt blandit. Morbi dictum mattis pretium. Mauris justo
              metus, faucibus nec purus vel, dapibus fermentum dui. Etiam sit
              amet odio iaculis leo tincidunt pulvinar nec id eros. Quisque
              dictum augue quis mattis sodales. Curabitur posuere ligula at
              dignissim facilisis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
