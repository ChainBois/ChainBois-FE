import React from 'react'

export default function BattleHero() {
  return (
      <section>
        <div className="container mx-auto p-4">
          <div className="">
            <h1 className="font-space-g mb-3 text-4xl font-bold text-white">
              Welcome to the Battleground
            </h1>
            <p className="text-white">
              Compete in live tournaments and climb the leaderboard. Earn
              $BATTLE, climb the ranks.
            </p>

            <button className="block cursor-pointer border-none bg-transparent outline-none focus-within:outline-none focus-visible:outline-none">
              <div className="mt-7 rounded-xs border border-white/20 p-1">
                <div className="inline-flex w-max items-center justify-center rounded-xs bg-red-600 px-4 py-3 text-white">
                  View Tournament
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
  )
}
