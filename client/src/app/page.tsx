"use client";
import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export default function Home() {
  const stages = new Array(4).fill(0);
  const [currStage, setCurrStage] = useState(0);

  function cycleForward() {
    if (currStage + 1 >= stages.length) return;
    setCurrStage(currStage + 1);
  }
  function cycleBackward() {
    if (currStage - 1 < 0) return;
    setCurrStage(currStage - 1);
  }
  function renderCurrentContent() {
    switch (currStage) {
      case 0:
        return (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-4xl font-bold	text-center">Leet Buddies</h2>
            <p className=" text-center">
              Buddy up with people on the same wavelength as you, and work
              towards a your shared leetcode goals!
            </p>
            <button onClick={cycleForward} className="hover:underline">
              {"<"}continute to login{">"}
            </button>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-4xl font-bold	text-center">
              Connect Discord Account
            </h2>
            <p className=" text-center">
              Discord is ideal for communicating with random strangers on the
              internet. So, for the sake of standardization, you can only login
              through discord.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-4xl font-bold	">Leet Buddies</h2>
            <p className=" text-center">
              Buddy up with people on the same wavelength as you, and work
              towards a your shared leetcode goals!
            </p>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-4xl font-bold	">Leet Buddies</h2>
            <p className=" text-center">
              Buddy up with people on the same wavelength as you, and work
              towards a your shared leetcode goals!
            </p>
          </div>
        );
      default:
        return <div>Error. How did you end up here?</div>;
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex gap-5">
        {stages.map((stage, idx) => (
          <div
            key={`${idx}`}
            className={clsx([
              "h-[10px] w-[10px] rounded border",
              idx == currStage ? "bg-white" : "",
            ])}
          ></div>
        ))}
      </div>
      <div className="p-12 rounded border m-10 max-w-3xl">
        {renderCurrentContent()}
        {currStage != 0 && (
          <div className="flex justify-between mt-5">
            <button onClick={cycleBackward} className="hover:underline">
              {"<"}go back{">"}
            </button>
            {currStage != stages.length - 1 && (
              <button onClick={cycleForward} className="hover:underline">
                {"<"}continute{">"}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
