import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceBackground } from './components/SpaceBackground';
import { Universe } from './pages/Universe';
import { Vault } from './pages/Vault';
import { TrophyRoom } from './pages/TrophyRoom';
import { BadgeWall } from './pages/BadgeWall';
import { Timeline } from './pages/Timeline';
import { Analytics } from './pages/Analytics';
import { CommandCenter } from './pages/CommandCenter';
import { CertificateModal } from './components/CertificateModal';
import { CursorSparks } from './components/CursorSparks';
import type { Achievement } from './data/achievementsData';
import { setSoundEnabled, playClick } from './utils/sounds';
import { Volume2, VolumeX, Menu, X, Award } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState<string>('universe');
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<string>('Courses');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Sound system state
  const [soundOn, setSoundOn] = useState<boolean>(false);
  
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Synchronize global sound utility state
    setSoundEnabled(soundOn);
  }, [soundOn]);

  // Interactive radial spotlight glow handler for cards with class bg-glass-card
  useEffect(() => {
    let currentCard: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;
      const card = target.closest('.bg-glass-card') as HTMLElement | null;
      
      if (currentCard && currentCard !== card) {
        currentCard.style.setProperty('--x', '50%');
        currentCard.style.setProperty('--y', '50%');
        currentCard.style.transform = '';
      }

      if (!card) {
        currentCard = null;
        return;
      }

      currentCard = card;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      card.style.setProperty('--x', `${pctX}%`);
      card.style.setProperty('--y', `${pctY}%`);
    };

    const handleMouseLeave = () => {
      if (currentCard) {
        currentCard.style.setProperty('--x', '50%');
        currentCard.style.setProperty('--y', '50%');
        currentCard.style.transform = '';
        currentCard = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleNavClick = (section: string) => {
    playClick();
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const handleUniverseCategorySelect = (category: string) => {
    // Map selected universe category directly to vault
    setSelectedVaultCategory(category);
    setActiveSection('vault');
  };

  const menuItems = [
    { id: 'universe', label: 'Universe', icon: '🌌' },
    { id: 'vault', label: 'Vault', icon: '📜' },
    { id: 'trophy', label: 'Trophy Room', icon: '🏆' },
    { id: 'badges', label: 'Badge Wall', icon: '🔰' },
    { id: 'timeline', label: 'Timeline', icon: '⏳' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'command-center', label: 'Command Center', icon: '👨‍🚀' },
  ];

  return (
    <div className="relative z-0 min-h-screen text-slate-100 font-sans pb-12 selection:bg-cyan-500/30 selection:text-white">
      {/* 1. Futuristic Space Background Canvas */}
      <SpaceBackground />
      <CursorSparks />

      {/* 2. Top Navigation Panel HUD console */}
      <header className="sticky top-0 z-40 bg-black/45 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center select-none">
          {/* Logo Brand */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleNavClick('universe')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white border border-cyan-400/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              <Award size={18} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-mono text-sm font-black tracking-widest text-white">
              V<span className="text-cyan-400">J</span>
            </span>
          </motion.div>

          {/* Desktop HUD navigation items */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/65 border border-white/5 rounded-xl p-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-glass border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] font-bold'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/3'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* HUD Right Controls (Sound, Console indicators) */}
          <div className="flex items-center gap-3">
            {/* Audio Wave Visualizer */}
            {soundOn && (
              <div className="hidden sm:flex items-end gap-[3px] h-4 px-2 select-none" title="Audio hum active">
                <span className="w-[2px] rounded-full bg-cyan-400 animate-sound-wave" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
                <span className="w-[2px] rounded-full bg-cyan-400 animate-sound-wave" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }} />
                <span className="w-[2px] rounded-full bg-cyan-400 animate-sound-wave" style={{ animationDelay: '0.5s', animationDuration: '0.5s' }} />
                <span className="w-[2px] rounded-full bg-cyan-400 animate-sound-wave" style={{ animationDelay: '0.2s', animationDuration: '0.7s' }} />
              </div>
            )}

            {/* Audio Toggle switch */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundOn(!soundOn)}
              className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer transition-all relative ${
                soundOn
                  ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400 shadow-neon-cyan'
                  : 'border-slate-800 bg-slate-950/50 text-slate-500'
              }`}
              title={soundOn ? 'Disable system sound' : 'Enable system sound'}
            >
              {soundOn ? (
                <>
                  <Volume2 size={15} />
                  <span className="absolute inset-0 rounded-lg border border-cyan-400 sound-ripple" />
                </>
              ) : (
                <VolumeX size={15} />
              )}
            </motion.button>

            {/* Mobile navigation toggle */}
            <button
              onClick={() => { playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-950/50 text-slate-400 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Dropdown Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden sticky top-[69px] z-30 w-full bg-slate-950/95 border-b border-white/5 backdrop-blur-xl select-none"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-glass border-cyan-500/30 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Active Dashboard Frame Wrapper */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {activeSection === 'universe' && (
              <Universe
                onSelectCategory={handleUniverseCategorySelect}
              />
            )}
            {activeSection === 'vault' && (
              <Vault
                initialCategory={selectedVaultCategory}
                onSelectAchievement={(item) => setSelectedAchievement(item)}
              />
            )}
            {activeSection === 'trophy' && <TrophyRoom />}
            {activeSection === 'badges' && <BadgeWall />}
            {activeSection === 'timeline' && <Timeline />}
            {activeSection === 'analytics' && <Analytics />}
            {activeSection === 'command-center' && <CommandCenter />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Holographic Decryption Certificate Modal Overlay */}
      <CertificateModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
}

export default App;
