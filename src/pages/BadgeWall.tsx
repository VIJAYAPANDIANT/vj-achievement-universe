import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ShieldCheck, Flame, BookOpen, Star, Sparkles, Terminal } from 'lucide-react';
import { achievementsData } from '../data/achievementsData';
import type { Achievement } from '../data/achievementsData';
import { playClick, playHover } from '../utils/sounds';

export const BadgeWall: React.FC = () => {
  // Filter for Badges category
  const badges = useMemo(() => {
    return achievementsData.filter((a) => a.category === 'Badges');
  }, []);

  const [selectedBadge, setSelectedBadge] = useState<Achievement>(badges[0] || null);

  // Style properties based on rarity
  const getRarityConfig = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return {
          textColor: 'text-amber-400',
          glowShadow: 'shadow-neon-orange',
          badgeBorder: 'border-amber-500/50 hover:border-amber-400',
          bgGlow: 'from-amber-500/20 via-orange-600/5 to-transparent',
          label: 'LEGENDARY',
          sparkle: '🔥',
          meterColor: 'bg-amber-400',
        };
      case 'epic':
        return {
          textColor: 'text-fuchsia-400',
          glowShadow: 'shadow-neon-pink',
          badgeBorder: 'border-fuchsia-500/40 hover:border-fuchsia-400',
          bgGlow: 'from-fuchsia-500/20 via-pink-600/5 to-transparent',
          label: 'EPIC',
          sparkle: '✨',
          meterColor: 'bg-fuchsia-400',
        };
      case 'rare':
        return {
          textColor: 'text-cyan-400',
          glowShadow: 'shadow-neon-cyan',
          badgeBorder: 'border-cyan-500/40 hover:border-cyan-400',
          bgGlow: 'from-cyan-500/20 via-blue-600/5 to-transparent',
          label: 'RARE',
          sparkle: '🌟',
          meterColor: 'bg-cyan-400',
        };
      default: // common
        return {
          textColor: 'text-slate-400',
          glowShadow: '',
          badgeBorder: 'border-slate-800 hover:border-slate-600',
          bgGlow: 'from-slate-800/10 via-slate-900/5 to-transparent',
          label: 'COMMON',
          sparkle: '⚙️',
          meterColor: 'bg-slate-400',
        };
    }
  };

  // Render badge emblem icon representation
  const renderBadgeEmblem = (iconName: string | undefined, colorClass: string) => {
    switch (iconName) {
      case 'knight':
        return <Zap className={`${colorClass} animate-pulse`} size={30} />;
      case 'gold_star':
        return <Star className={`${colorClass} animate-pulse`} size={30} />;
      case 'gcp_ai':
        return <Flame className={`${colorClass} animate-pulse`} size={30} />;
      case 'azure_dev':
        return <ShieldCheck className={`${colorClass} animate-pulse`} size={30} />;
      case 'aws_cp':
        return <BookOpen className={`${colorClass} animate-pulse`} size={30} />;
      case 'deep_learning':
        return <Sparkles className={`${colorClass} animate-pulse`} size={30} />;
      default:
        return <Award className={`${colorClass} animate-pulse`} size={30} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-140px)] flex flex-col z-10 select-none">
      {/* Header Telemetry */}
      <div className="flex flex-col border-l border-cyan-500/30 pl-4 py-1 mb-8">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Decryption Console Active</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-1">
          BADGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">WALL</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Review gamified skill achievements, learning badges, and unlocked code certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Badges Shelf */}
        <div className="lg:col-span-2 bg-glass border border-white/5 rounded-xl p-6">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-4">
            ACHIEVEMENTS ARCHIVE ({badges.length} UNLOCKED)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const config = getRarityConfig(badge.rarity || 'common');
              const isSelected = selectedBadge?.id === badge.id;

              return (
                <motion.div
                  key={badge.id}
                  onClick={() => {
                    playClick();
                    setSelectedBadge(badge);
                  }}
                  onMouseEnter={playHover}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-glass-card border rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer relative overflow-hidden transition-all min-h-[195px] ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400/30'
                      : config.badgeBorder
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? '0 0 15px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05)'
                      : '',
                  }}
                >
                  {/* Small Rarity Sparkle */}
                  <span className="absolute top-2 right-2 text-[10px]" title={config.label}>
                    {config.sparkle}
                  </span>

                  {/* Emblem Circle */}
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border bg-slate-950/80 mb-2.5 relative flex-shrink-0 ${
                      isSelected ? 'border-cyan-400' : 'border-white/5'
                    }`}
                  >
                    {renderBadgeEmblem(badge.badgeIcon, config.textColor)}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Badge Title & Platform Info Container */}
                  <div className="w-full flex flex-col items-center justify-center flex-1 my-1">
                    <h4 className="text-[11px] sm:text-xs font-bold text-slate-100 tracking-wide uppercase text-center leading-snug line-clamp-3 w-full">
                      {badge.title}
                    </h4>

                    {/* Platform Subtag */}
                    <span className="text-[9px] text-slate-400 font-mono mt-2 uppercase truncate w-full block">
                      {badge.issuer}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Telemetry Diagnostics HUD */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedBadge ? (
              <motion.div
                key={selectedBadge.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-glass border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden scanline shadow-[0_0_30px_rgba(6,182,212,0.05)]"
              >
                {/* Visual scan indicator */}
                <div className="absolute inset-0 hologram-scan pointer-events-none" />

                {/* Badge Rarity config */}
                {(() => {
                  const config = getRarityConfig(selectedBadge.rarity || 'common');
                  return (
                    <>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4 font-mono text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Terminal size={11} /> BADGE DIAGNOSTIC
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold border ${config.textColor} border-current/20 bg-white/2`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Giant spinning holographic emblem */}
                      <div className="flex flex-col items-center justify-center my-6">
                        <div
                          className={`w-24 h-24 rounded-full border-2 bg-slate-950/90 flex items-center justify-center relative ${config.glowShadow}`}
                          style={{ borderColor: selectedBadge.rarity === 'legendary' ? '#f59e0b' : selectedBadge.rarity === 'epic' ? '#d946ef' : selectedBadge.rarity === 'rare' ? '#06b6d4' : '#475569' }}
                        >
                          {renderBadgeEmblem(selectedBadge.badgeIcon, config.textColor)}
                          {/* Outer orbiting ring decoration */}
                          <div className="absolute inset-[-6px] rounded-full border border-dashed border-white/10 animate-spin-slow" />
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-4 text-glow-cyan uppercase font-mono tracking-wider text-center">
                          {selectedBadge.title}
                        </h3>
                        <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mt-1">
                          PLATFORM: {selectedBadge.issuer}
                        </span>
                      </div>

                      {/* Criteria */}
                      <div className="space-y-4">
                        <div className="border-l-2 border-cyan-500/30 pl-3 py-1 bg-white/2 rounded-r-md">
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Description</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-0.5">
                            {selectedBadge.description}
                          </p>
                        </div>

                        {/* Tech skills unlocked meters */}
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">UNLOCKED COMPETENCY MATRIX</span>
                          <div className="space-y-1.5 font-mono text-[10px]">
                            {selectedBadge.skills.map((skill, idx) => (
                              <div key={skill} className="space-y-1">
                                <div className="flex justify-between text-slate-400">
                                  <span>{skill}</span>
                                  <span className="text-cyan-400">Level {10 - idx * 2}</span>
                                </div>
                                <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-white/5">
                                  <div
                                    className={`h-full ${config.meterColor}`}
                                    style={{ width: `${100 - idx * 20}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-slate-500 flex justify-between">
                          <span>TIMESTAMP: {selectedBadge.issueDate}</span>
                          <span>STATUS: SECURE_SYNC</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="bg-glass border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
                SELECT AN EMBLEM TO INITIALIZE PREVIEW
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
