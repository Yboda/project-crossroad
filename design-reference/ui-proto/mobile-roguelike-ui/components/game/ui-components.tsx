"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { ReactNode } from "react"

// Gothic Button Component
interface GothicButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  icon?: LucideIcon
  className?: string
  disabled?: boolean
}

export function GothicButton({ 
  children, 
  onClick, 
  variant = 'primary',
  icon: Icon,
  className,
  disabled = false
}: GothicButtonProps) {
  const variants = {
    primary: "bg-zinc-900 border-gold-dim hover:border-gold hover:bg-zinc-800 text-gold-bright shadow-[0_0_15px_rgba(0,0,0,0.8)]",
    secondary: "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600",
    ghost: "bg-transparent border-transparent text-zinc-500 hover:text-gold",
    danger: "bg-blood/20 border-blood/50 text-red-400 hover:bg-blood/40",
  }
  
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-3.5 px-4 flex items-center justify-center gap-2",
        "border transition-all duration-300 tracking-wider",
        "font-serif text-[15px]",
        "disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 opacity-70" />}
      {children}
    </motion.button>
  )
}

// Gothic Panel Component
interface PanelProps {
  children: ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return (
    <div className={cn(
      "gothic-panel rounded-sm",
      className
    )}>
      {children}
    </div>
  )
}

// Stat Bar Component
interface StatBarProps {
  value: number
  max: number
  colorClass?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StatBar({ 
  value, 
  max, 
  colorClass = 'bg-blood',
  showText = false,
  size = 'sm'
}: StatBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  
  return (
    <div className="w-full flex items-center gap-2">
      <div className={cn(
        "flex-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50",
        heights[size]
      )}>
        <motion.div 
          className={cn("h-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {showText && (
        <span className="text-[10px] text-zinc-400 min-w-[45px] text-right">
          {value}/{max}
        </span>
      )}
    </div>
  )
}

// Resource Display Component
interface ResourceDisplayProps {
  icon: LucideIcon
  value: number | string
  label?: string
  colorClass?: string
}

export function ResourceDisplay({ icon: Icon, value, label, colorClass = 'text-gold' }: ResourceDisplayProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {label && <span className="text-zinc-500">{label}</span>}
      <span className={colorClass}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
      <Icon className={cn("w-3.5 h-3.5", colorClass)} />
    </div>
  )
}

// Enemy Intent Icon
interface IntentIconProps {
  intent: 'attack' | 'defend' | 'buff' | 'special'
  value?: number
}

export function IntentIcon({ intent, value }: IntentIconProps) {
  const intents = {
    attack: { bg: 'bg-red-950/50', border: 'border-red-900', color: 'text-red-500' },
    defend: { bg: 'bg-blue-950/50', border: 'border-blue-900', color: 'text-blue-500' },
    buff: { bg: 'bg-purple-950/50', border: 'border-purple-900', color: 'text-purple-500' },
    special: { bg: 'bg-orange-950/50', border: 'border-orange-900', color: 'text-orange-500' },
  }
  
  const intentIcons = {
    attack: '⚔️',
    defend: '🛡️',
    buff: '✨',
    special: '💀',
  }
  
  const style = intents[intent]
  
  return (
    <div className={cn(
      "w-8 h-8 flex items-center justify-center rounded border",
      style.bg, style.border
    )}>
      <span className="text-sm">{intentIcons[intent]}</span>
      {value && (
        <span className={cn("absolute -bottom-1 -right-1 text-[10px] font-bold", style.color)}>
          {value}
        </span>
      )}
    </div>
  )
}

// Relic Icon Component
interface RelicIconProps {
  icon: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  onClick?: () => void
}

export function RelicIcon({ icon, name, size = 'md', selected, onClick }: RelicIconProps) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded border bg-zinc-900 cursor-pointer",
        sizes[size],
        selected ? "border-gold shadow-[0_0_10px_rgba(193,163,95,0.3)]" : "border-zinc-700",
        onClick && "hover:border-gold-dim"
      )}
      title={name}
    >
      <span>{icon}</span>
    </motion.div>
  )
}

// Section Divider
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center gap-4", className)}>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gold-dim/50" />
      <div className="w-2 h-2 rotate-45 border border-gold-dim/50" />
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gold-dim/50" />
    </div>
  )
}

// Choice Card Component
interface ChoiceCardProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'normal' | 'danger' | 'safe' | 'locked'
  icon?: string
  className?: string
}

export function ChoiceCard({ children, onClick, variant = 'normal', icon, className }: ChoiceCardProps) {
  const variants = {
    normal: "border-zinc-800 hover:border-gold-dim bg-zinc-900/50",
    danger: "border-red-900/50 hover:border-red-700 bg-red-950/20",
    safe: "border-green-900/50 hover:border-green-700 bg-green-950/20",
    locked: "border-zinc-800 bg-zinc-900/30 opacity-50 cursor-not-allowed",
  }
  
  return (
    <motion.button
      whileTap={variant !== 'locked' ? { scale: 0.98 } : undefined}
      onClick={variant !== 'locked' ? onClick : undefined}
      className={cn(
        "w-full p-4 flex items-center gap-3 border rounded transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-sm text-zinc-300 text-left flex-1">{children}</span>
    </motion.button>
  )
}
