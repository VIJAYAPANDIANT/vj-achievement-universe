import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Users, Calendar, Sparkles, ExternalLink } from 'lucide-react';
import { achievementsData } from '../data/achievementsData';
import type { Achievement } from '../data/achievementsData';
import { playClick, playHover } from '../utils/sounds';
import { formatShortDateWithMonth } from '../utils/date';

export const TrophyRoom: React.FC = () => {
  // Filter for hackathons and competitions
  const trophies = useMemo(() => {
    return achievementsData.filter(
      (a) => a.category === 'Hackathons' || a.category === 'Competitions'
    );
  }, []);

  // Split into Gold (1st / Winner), Silver (2nd / Runner-up), Bronze (3rd), and Other (Participation)
  const categorizedTrophies = useMemo(() => {
    const gold: Achievement[] = [];
    const silver: Achievement[] = [];
    const bronze: Achievement[] = [];
    const participation: Achievement[] = [];

    trophies.forEach((t) => {
      const sub = t.subCategory.toLowerCase();
      const place = t.place?.toLowerCase() || '';
      
      if (sub.includes('1st') || place.includes('1st') || place.includes('winner')) {
        gold.push(t);
      } else if (sub.includes('2nd') || place.includes('2nd') || place.includes('runner-up') || place.includes('runners-up')) {
        silver.push(t);
      } else if (sub.includes('3rd') || place.includes('3rd')) {
        bronze.push(t);
      } else {
        participation.push(t);
      }
    });

    return { gold, silver, bronze, participation };
  }, [trophies]);

  // Trophy colors and neon shadows
  const getRankStyle = (rank: 'gold' | 'silver' | 'bronze' | 'participation') => {
    switch (rank) {
      case 'gold':
        return {
          titleColor: 'text-amber-400',
          glowColor: 'shadow-neon-orange',
          badgeBg: 'bg-amber-950/30 border-amber-500/20 text-amber-300',
          gradient: 'from-amber-500/10 via-orange-600/5 to-transparent',
          medal: '🏆',
          borderGlow: 'hover:border-amber-500/40',
        };
      case 'silver':
        return {
          titleColor: 'text-slate-300',
          glowColor: 'shadow-neon-cyan',
          badgeBg: 'bg-slate-800/30 border-slate-500/20 text-slate-300',
          gradient: 'from-slate-500/10 via-slate-600/5 to-transparent',
          medal: '🥈',
          borderGlow: 'hover:border-slate-400/40',
        };
      case 'bronze':
        return {
          titleColor: 'text-amber-700',
          glowColor: 'shadow-neon-purple',
          badgeBg: 'bg-amber-900/20 border-amber-700/20 text-amber-600',
          gradient: 'from-amber-700/10 via-purple-900/5 to-transparent',
          medal: '🥉',
          borderGlow: 'hover:border-amber-700/40',
        };
      default:
        return {
          titleColor: 'text-cyan-400',
          glowColor: 'shadow-neon-green',
          badgeBg: 'bg-cyan-950/20 border-cyan-500/20 text-cyan-400',
          gradient: 'from-cyan-500/5 via-slate-900/5 to-transparent',
          medal: '🎖️',
          borderGlow: 'hover:border-cyan-500/30',
        };
    }
  };

  const renderTrophyCard = (item: Achievement, rankType: 'gold' | 'silver' | 'bronze' | 'participation') => {
    const style = getRankStyle(rankType);
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        onMouseEnter={playHover}
        className={`bg-glass-card border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between ${style.borderGlow}`}
      >
        {/* Background glow gradient */}
        <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br ${style.gradient} filter blur-xl`} />

        {/* Cyber Scanning line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -translate-y-full hover:animate-[scan_2.5s_linear_infinite]" />

        <div>
          {/* Top telemetry info */}
          <div className="flex justify-between items-center mb-4 select-none">
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${style.badgeBg} flex items-center gap-1`}>
              <span className="text-[10px]">{style.medal}</span> {item.place || item.subCategory.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Calendar size={11} /> {formatShortDateWithMonth(item.issueDate)}
            </span>
          </div>

          {/* Project Title (if hackathon) */}
          {item.projectTitle && (
            <div className="mb-1 text-[10px] text-cyan-400 font-mono uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Sparkles size={10} /> PROJECT: {item.projectTitle}
            </div>
          )}

          {/* Achievement Title */}
          <h3 className="text-base font-extrabold text-slate-200 group-hover:text-white uppercase font-mono tracking-wide mb-2 line-clamp-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Footer info (GitHub, Team details) */}
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center select-none font-mono text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>ISSUER: {item.issuer}</span>
            {item.teamSize && (
              <span className="flex items-center gap-1">
                <Users size={11} /> Size: {item.teamSize}
              </span>
            )}
          </div>

          {item.projectUrl && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playClick}
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <GitBranch size={12} /> REPO <ExternalLink size={8} />
            </motion.a>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-140px)] flex flex-col z-10 select-none">
      {/* Header Telemetry */}
      <div className="flex flex-col border-l border-cyan-500/30 pl-4 py-1 mb-8">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Decryption Console Active</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-1">
          TROPHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">ROOM</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Explore hackathon accomplishments, placements, coding contests, and custom code builds.
        </p>
      </div>

      {/* Grid displays based on placements */}
      <div className="space-y-12">
        {/* GOLD Ranks */}
        {categorizedTrophies.gold.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-amber-400 font-mono border-b border-amber-500/20 pb-2 flex items-center gap-2 select-none">
              <span>🏆</span> GOLD MATRIX / 1ST PLACE SECTOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorizedTrophies.gold.map((t) => renderTrophyCard(t, 'gold'))}
            </div>
          </div>
        )}

        {/* SILVER Ranks */}
        {categorizedTrophies.silver.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-300 font-mono border-b border-slate-500/20 pb-2 flex items-center gap-2 select-none">
              <span>🥈</span> SILVER MATRIX / RUNNER-UP SECTOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorizedTrophies.silver.map((t) => renderTrophyCard(t, 'silver'))}
            </div>
          </div>
        )}

        {/* BRONZE Ranks */}
        {categorizedTrophies.bronze.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-amber-700 font-mono border-b border-amber-700/20 pb-2 flex items-center gap-2 select-none">
              <span>🥉</span> BRONZE MATRIX / 3RD PLACE SECTOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorizedTrophies.bronze.map((t) => renderTrophyCard(t, 'bronze'))}
            </div>
          </div>
        )}

        {/* PARTICIPATION & OTHER COMPETITIONS */}
        {categorizedTrophies.participation.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-cyan-400 font-mono border-b border-cyan-500/20 pb-2 flex items-center gap-2 select-none">
              <span>🎖️</span> MISSION LOGS / PARTICIPATION SECTOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorizedTrophies.participation.map((t) => renderTrophyCard(t, 'participation'))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
