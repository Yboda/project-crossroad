"use client"

import { useGameStore } from "@/lib/game-store"
import { Modals } from "./modals"
import { DevConsole } from "./dev-console"
import { AnimatePresence, motion } from "framer-motion"
import {
  LobbyScreen,
  BodySelectScreen,
  EngravingScreen,
  ExplorationScreen,
  CombatScreen,
  VictoryScreen,
  ShopScreen,
  EventScreen,
  RestScreen,
  DeathScreen,
  EndingScreen,
} from "./screens"

export function GameContainer() {
  const { currentScreen } = useGameStore()

  const getScreen = () => {
    switch (currentScreen) {
      case 'lobby':
        return <LobbyScreen />
      case 'body-select':
        return <BodySelectScreen />
      case 'engraving':
        return <EngravingScreen />
      case 'explore':
        return <ExplorationScreen />
      case 'combat':
        return <CombatScreen />
      case 'victory':
        return <VictoryScreen />
      case 'shop':
      case 'shop-buy':
        return <ShopScreen />
      case 'event':
        return <EventScreen />
      case 'rest':
        return <RestScreen />
      case 'death':
        return <DeathScreen />
      case 'ending':
        return <EndingScreen />
      default:
        return <LobbyScreen />
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black w-full text-zinc-300 font-sans selection:bg-gold-dim/30 sm:p-4">
      {/* Mobile Mockup Container */}
      <div className="mobile-frame relative w-full h-screen sm:h-[844px] sm:w-[390px] bg-[#050505] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {getScreen()}
          </motion.div>
        </AnimatePresence>
        <Modals />
      </div>
      
      {/* Dev Console */}
      <DevConsole />
    </div>
  )
}
