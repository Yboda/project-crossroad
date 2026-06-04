import { Outlet } from "react-router";
import { GameProvider } from "./store";
import { Modals } from "./components/Modals";

export function Root() {
  return (
    <GameProvider>
      <div className="flex justify-center items-center min-h-screen bg-black w-full text-zinc-300 font-sans selection:bg-[#8a6b32]/30 sm:p-4">
        {/* Mobile Mockup Container */}
        <div className="relative w-full h-full sm:w-[390px] sm:h-[844px] bg-[#050505] sm:rounded-[40px] sm:overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] sm:border-[8px] sm:border-zinc-900 flex flex-col">
           <Outlet />
           <Modals />
        </div>
      </div>
    </GameProvider>
  );
}
