import { Outlet, useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const SCREENS = [
  { path: "/", name: "1. Main Lobby" },
  { path: "/body-select", name: "2. Body Selection" },
  { path: "/engraving", name: "3. Soul Engraving" },
  { path: "/exploration", name: "4. Exploration" },
  { path: "/combat", name: "5. Combat" },
  { path: "/reward", name: "6. Victory / Reward" },
  { path: "/level-up", name: "7. Level Up Modal" },
  { path: "/shop", name: "8. Shop Main" },
  { path: "/shop-item", name: "9. Shop Item" },
  { path: "/status", name: "10. Status / Relics" },
  { path: "/relic", name: "11. Relic Acquired" },
  { path: "/death", name: "12. Death Screen" },
];

export function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center relative font-sans overflow-hidden">
      
      {/* Dev Navigation Panel */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-dark-bg border-r border-gold-dim z-50 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gold-dim flex justify-between items-center bg-black/50">
          <h2 className="text-gold font-serif text-sm">Screens Navigation</h2>
          <button onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-2 flex flex-col gap-1 overflow-y-auto h-[calc(100vh-60px)]">
          {SCREENS.map((s) => (
            <button
              key={s.path}
              onClick={() => navigate(s.path)}
              className={`text-left px-3 py-2 text-sm rounded ${location.pathname === s.path ? 'bg-gold-dim/30 text-gold' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Toggle Button */}
      {!menuOpen && (
        <button 
          onClick={() => setMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-dark-bg border border-gold-dim rounded text-gold"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Frame Container */}
      <div className="relative w-[390px] h-[844px] bg-dark-bg overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-gold-dim/30 rounded-[32px] sm:rounded-[40px]">
        {/* Hardware details mockup */}
        <div className="absolute top-0 w-full h-7 z-50 flex justify-center pt-2">
          <div className="w-32 h-6 bg-black rounded-full shadow-inner"></div>
        </div>
        
        {/* App Content */}
        <div className="w-full h-full relative">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}
