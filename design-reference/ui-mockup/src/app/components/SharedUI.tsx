import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GothicButton({ 
  children, 
  onClick, 
  variant = 'default',
  className
}: { 
  children: ReactNode; 
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  className?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full py-3.5 px-4 text-center transition-all duration-300 relative overflow-hidden flex items-center justify-center",
        variant !== 'ghost' && "gothic-border rounded-sm",
        variant === 'default' && "bg-black/60 text-text-main hover:bg-white/10 hover:border-gold",
        variant === 'primary' && "bg-gradient-to-t from-gold-dim/30 to-transparent text-gold hover:from-gold-dim/50 border-gold shadow-[0_0_15px_rgba(193,163,95,0.2)]",
        variant === 'danger' && "bg-blood/20 text-[#ff8888] border-[#8B2020] hover:bg-blood/40",
        variant === 'ghost' && "bg-transparent text-text-muted hover:text-text-main",
        className
      )}
    >
      <span className="font-serif text-[17px] tracking-widest drop-shadow-md z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20 mix-blend-overlay"></div>
      )}
    </button>
  );
}

export function GothicPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("gothic-panel rounded-sm p-4 relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
