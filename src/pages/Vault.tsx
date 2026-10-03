import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, Layers, FileText } from 'lucide-react';
import { achievementsData } from '../data/achievementsData';
import type { Achievement } from '../data/achievementsData';
import { playClick, playHover } from '../utils/sounds';

interface VaultProps {
  initialCategory: string;
  onSelectAchievement: (achievement: Achievement) => void;
}

export const Vault: React.FC<VaultProps> = ({ initialCategory, onSelectAchievement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set default category. If initialCategory is "all", clear it.
  const [selectedCategory, setSelectedCategory] = useState<string>('Courses');

  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Collect all unique issuers and skills for filter options
  const filterOptions = useMemo(() => {
    const issuers = new Set<string>();
    const skills = new Set<string>();
    
    // We only show filters for the active category to keep it neat
    const filteredByCategory = selectedCategory 
      ? achievementsData.filter(a => a.category === selectedCategory)
      : achievementsData;

    filteredByCategory.forEach(a => {
      issuers.add(a.issuer);
      a.skills.forEach(s => skills.add(s));
    });

    return {
      issuers: Array.from(issuers),
      skills: Array.from(skills).slice(0, 15), // Cap skill filters at 15 for UI neatness
    };
  }, [selectedCategory]);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedIssuers([]);
    setSelectedSkills([]);
  }, [selectedCategory]);

  const handleIssuerToggle = (issuer: string) => {
    playClick();
    setSelectedIssuers(prev => 
      prev.includes(issuer) ? prev.filter(i => i !== issuer) : [...prev, issuer]
    );
  };

  const handleSkillToggle = (skill: string) => {
    playClick();
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleResetFilters = () => {
    playClick();
    setSearchQuery('');
    setSelectedIssuers([]);
    setSelectedSkills([]);
  };

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    return achievementsData.filter(achievement => {
      // 1. Category Filter
      if (selectedCategory && achievement.category !== selectedCategory) return false;
      
      // 2. Search Query Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = achievement.title.toLowerCase().includes(query);
        const matchesIssuer = achievement.issuer.toLowerCase().includes(query);
        const matchesDesc = achievement.description.toLowerCase().includes(query);
        const matchesSkills = achievement.skills.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesIssuer && !matchesDesc && !matchesSkills) return false;
      }

      // 3. Issuer Filter
      if (selectedIssuers.length > 0 && !selectedIssuers.includes(achievement.issuer)) return false;

      // 4. Skills Filter
      if (selectedSkills.length > 0 && !selectedSkills.every(s => achievement.skills.includes(s))) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, selectedIssuers, selectedSkills]);

  // Categories list
  const categories = ['Courses', 'Internships', 'Hackathons', 'Workshops', 'Competitions'];

  // Platform/Issuer Icons/Theme colors
  const getCardTheme = (issuer: string) => {
    const is = issuer.toLowerCase();
    if (is.includes('google')) return { glow: 'group-hover:border-blue-500/30', glowShadow: 'shadow-neon-blue', labelBg: 'bg-blue-950/30 text-blue-400 border-blue-500/20' };
    if (is.includes('aws') || is.includes('amazon')) return { glow: 'group-hover:border-orange-500/30', glowShadow: 'shadow-neon-orange', labelBg: 'bg-orange-950/30 text-orange-400 border-orange-500/20' };
    if (is.includes('microsoft')) return { glow: 'group-hover:border-cyan-500/30', glowShadow: 'shadow-neon-cyan', labelBg: 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20' };
    if (is.includes('coursera')) return { glow: 'group-hover:border-blue-600/30', glowShadow: 'shadow-neon-blue', labelBg: 'bg-blue-950/30 text-blue-400 border-blue-600/20' };
    if (is.includes('udemy')) return { glow: 'group-hover:border-purple-500/30', glowShadow: 'shadow-neon-purple', labelBg: 'bg-purple-950/30 text-purple-400 border-purple-500/20' };
    
    return { glow: 'group-hover:border-cyan-500/30', glowShadow: 'shadow-neon-cyan', labelBg: 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20' };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-140px)] flex flex-col z-10 select-none">
      {/* Telemetry Header */}
      <div className="flex flex-col border-l border-cyan-500/30 pl-4 py-1 mb-8">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Decryption Console Active</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-1">
          CERTIFICATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">VAULT</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Query, filter, and inspect verified learning credentials and records.
        </p>
      </div>

      {/* Main Categories Navigation Grid */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playClick();
              setSelectedCategory(cat);
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-950 to-purple-950 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                : 'border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter HUD panel */}
        <div className="lg:col-span-1 bg-glass border border-white/5 rounded-xl p-5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
              <Filter size={14} /> FILTER_HUB
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors font-mono cursor-pointer"
            >
              <RefreshCw size={10} className="animate-spin-slow" /> RESET
            </button>
          </div>

          {/* Search HUD */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Real-time Query</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Issuers Filter checkboxes */}
          {filterOptions.issuers.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Credential Issuer</label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {filterOptions.issuers.map((issuer) => (
                  <label
                    key={issuer}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIssuers.includes(issuer)}
                      onChange={() => handleIssuerToggle(issuer)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                    <span className="font-sans text-[11px] truncate">{issuer}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Skills Filter tags */}
          {filterOptions.skills.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Competency Tags</label>
              <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                {filterOptions.skills.map((skill) => {
                  const isActive = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-purple-950 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                          : 'border-white/5 bg-slate-950 text-slate-500 hover:border-white/10 hover:text-slate-300'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Certificates Grid Showcase */}
        <div className="lg:col-span-3">
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-500 mb-4 select-none">
            <span>QUERY MATCHES: {filteredAchievements.length} CREDENTIALS FOUND</span>
            <span>SYSTEM CORRELATION: v1.02</span>
          </div>

          <AnimatePresence mode="wait">
            {filteredAchievements.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="w-full bg-glass border border-dashed border-white/10 rounded-xl p-12 text-center flex flex-col items-center justify-center"
              >
                <Layers className="text-slate-600 mb-3 animate-pulse" size={28} />
                <h3 className="text-sm font-bold text-slate-400 uppercase font-mono">No telemetry matching query</h3>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xs font-mono">
                  Modify the filter matrices or reset system parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-3 py-1.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                >
                  SYSTEM RESET
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredAchievements.map((item) => {
                  const cardTheme = getCardTheme(item.issuer);
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => {
                        playClick();
                        onSelectAchievement(item);
                      }}
                      onMouseEnter={playHover}
                      className={`group bg-glass-card rounded-xl p-5 flex flex-col justify-between border border-white/5 cursor-pointer relative overflow-hidden ${cardTheme.glow}`}
                    >
                      {/* Interactive scanner sweep beam line */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />

                      <div>
                        {/* Card top details */}
                        <div className="flex justify-between items-start mb-3 select-none">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border ${cardTheme.labelBg}`}>
                            {item.issuer}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.issueDate}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors uppercase font-mono tracking-wide line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Snippet */}
                        <p className="text-[11px] text-slate-400 mt-2 font-sans line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center select-none">
                        {/* Render first 3 skills tags */}
                        <div className="flex gap-1 overflow-hidden max-w-[70%]">
                          {item.skills.slice(0, 2).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-500 border border-white/2 bg-black/20">
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 2 && (
                            <span className="text-[8px] text-slate-600 font-mono pt-0.5">+{item.skills.length - 2}</span>
                          )}
                        </div>

                        {/* Action status */}
                        <span className="text-[9px] font-mono text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 group-hover:underline transition-all">
                          <FileText size={10} /> PROOF
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
