import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Award, Radar, Network, Terminal, 
  Layers
} from 'lucide-react';
import { achievementsData } from '../data/achievementsData';
import { playClick, playHover, playScan, playUnlock } from '../utils/sounds';


// Type definitions
interface RadarSkill {
  name: string;
  level: number; // 0 to 100
  category: 'frontend' | 'backend' | 'cloud' | 'language';
  x: number;
  y: number;
}

export const CommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'specialization' | 'radar'>('status');
  const [radarRotating, setRadarRotating] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFeatured, setSelectedFeatured] = useState<string | null>(null);

  // Compute stats from achievementsData
  const stats = useMemo(() => {
    const courses = achievementsData.filter(a => a.category === 'Courses').length;
    const hackathons = achievementsData.filter(a => a.category === 'Hackathons').length;
    const internships = achievementsData.filter(a => a.category === 'Internships').length;
    const workshops = achievementsData.filter(a => a.category === 'Workshops').length;
    const competitions = achievementsData.filter(a => a.category === 'Competitions').length;
    const badges = achievementsData.filter(a => a.category === 'Badges').length;
    
    // Count wins (where place contains winner or 1st or 2nd or 3rd)
    const wins = achievementsData.filter(a => 
      a.place && (
        a.place.toLowerCase().includes('winner') || 
        a.place.toLowerCase().includes('1st') || 
        a.place.toLowerCase().includes('2nd') || 
        a.place.toLowerCase().includes('3rd') || 
        a.place.toLowerCase().includes('runner-up') ||
        a.place.toLowerCase().includes('rank')
      )
    ).length;

    // Count projects built (Hackathons usually have project titles)
    const projects = achievementsData.filter(a => a.projectTitle).length + 8; // base + mock extra personal projects

    return { courses, hackathons, wins, internships, workshops, competitions, badges, projects };
  }, []);



  // Identity scan simulator
  const triggerIdentityScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    playScan();
    setScanProgress(0);
    const scanInterval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(scanInterval);
          setTimeout(() => {
            setIsScanning(false);
            playUnlock();
          }, 600);
          return 100;
        }
        return p + 2.5;
      });
    }, 45);
  };

  // Radar Skills positioning logic
  const radarSkills: RadarSkill[] = useMemo(() => {
    const skillsList: Omit<RadarSkill, 'x' | 'y'>[] = [
      { name: 'React.js', level: 90, category: 'frontend' },
      { name: 'JavaScript', level: 95, category: 'language' },
      { name: 'TypeScript', level: 88, category: 'language' },
      { name: 'Node.js', level: 82, category: 'backend' },
      { name: 'Firebase', level: 80, category: 'backend' },
      { name: 'Java', level: 85, category: 'language' },
      { name: 'Python', level: 78, category: 'language' },
      { name: 'Cloud Computing', level: 85, category: 'cloud' },
      { name: 'AI/ML', level: 75, category: 'cloud' },
      { name: 'SQL', level: 82, category: 'backend' },
    ];

    const cx = 150;
    const cy = 150;
    const maxRadius = 110;

    return skillsList.map((skill, idx) => {
      const angle = (idx * Math.PI * 2) / skillsList.length;
      const radius = (skill.level / 100) * maxRadius;
      return {
        ...skill,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      };
    });
  }, []);

  // Objectives progress simulation mapping
  const objectives = [
    { name: 'Full Stack Development', progress: 92, status: 'EXCELLENT', color: 'from-cyan-500 to-blue-500' },
    { name: 'Cloud Computing', progress: 85, status: 'ADVANCED', color: 'from-blue-500 to-purple-500' },
    { name: 'AI & Machine Learning', progress: 74, status: 'STABLE', color: 'from-purple-500 to-pink-500' },
    { name: 'Open Source Contributions', progress: 60, status: 'EVOLVING', color: 'from-pink-500 to-orange-500' },
    { name: 'Internship Opportunities', progress: 100, status: 'COMPLETED', color: 'from-emerald-500 to-cyan-500' },
  ];

  // Featured items definitions matching achievementsData
  const featuredAchievements = [
    {
      id: 'zero2site',
      tag: '💼 SYSTEM DEPLOYMENTS',
      title: 'Cloud Development Intern',
      place: 'Zero2site',
      description: 'Engaged in client demonstration projects, configured custom REST APIs, and managed cloud deployment architectures.',
      skills: ['Cloud Development', 'Client Demo Projects', 'API Configurations'],
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/25',
      accentColor: 'text-emerald-400',
      badge: '💼 CORE ARCHITECT'
    },
    {
      id: 'cognifyz',
      tag: '☕ CORE DEVELOPMENT',
      title: 'Java Development Intern',
      place: 'Cognifyz Technologies',
      description: 'Implemented core Java systems, worked on complexity optimizations, solved structural problems, and coordinated with teams.',
      skills: ['Java Development', 'Core Java', 'Problem Solving'],
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/25',
      accentColor: 'text-blue-400',
      badge: '☕ JAVA DEVELOPER'
    },
    {
      id: 'novitech-da',
      tag: '📊 STATISTICAL ANALYSIS',
      title: 'Data Analytics Intern',
      place: 'NoviTech R&D',
      description: 'Successfully conducted statistical analysis and designed data visualizations to extract actionable insights.',
      skills: ['Data Analytics', 'Statistical Analysis', 'Data Visualization'],
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)] border-cyan-500/25',
      accentColor: 'text-cyan-400',
      badge: '📊 DATA ANALYST'
    },
    {
      id: 'novitech-ml',
      tag: '🧠 MODEL ENGINEERING',
      title: 'Machine Learning Intern',
      place: 'NoviTech R&D',
      description: 'Trained ML predictive models, evaluated metrics, and processed data layers for automated systems.',
      skills: ['Machine Learning', 'Model Training', 'Predictive Analytics'],
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)] border-purple-500/25',
      accentColor: 'text-purple-400',
      badge: '🧠 AI ENGINEER'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 select-none font-mono text-slate-100">


      {/* ─── MAIN GRID LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= COLUMN 1: OPERATOR CORE REGISTER (4 COLS) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Card: Identity Console */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass-card border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center"
          >
            {/* Scan Sweep overlay */}
            {isScanning && (
              <motion.div 
                className="absolute inset-x-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-25"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Futuristic Avatar ring system */}
            <div className="relative w-36 h-36 mb-6 flex items-center justify-center cursor-pointer group" onClick={triggerIdentityScan}>
              {/* Ring 1: Cyan outer dotted spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]" />
              {/* Ring 2: Purple medium solid spinning ring */}
              <div className="absolute -inset-2 rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite_reverse]" />
              {/* Ring 3: Cyan target crosshairs */}
              <div className="absolute -inset-3 rounded-full border border-dashed border-cyan-400/10 group-hover:border-cyan-400/30 transition-colors" />
              
              {/* Actual Profile Photo Container */}
              <div className="w-[124px] h-[124px] rounded-full overflow-hidden border-2 border-cyan-400/40 relative z-10 bg-slate-950 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <img 
                  src="/avatar.jpg" 
                  alt="Operator Profile" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Scanner scan overlay box */}
              {isScanning && (
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full z-15 backdrop-blur-[0.5px] animate-pulse" />
              )}
            </div>

            {/* Scan ID action button */}
            <button 
              onClick={() => { playClick(); triggerIdentityScan(); }}
              className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded border mb-6 transition-all cursor-pointer ${
                isScanning 
                  ? 'border-cyan-400/50 bg-cyan-950/20 text-cyan-400 animate-pulse'
                  : 'border-white/10 hover:border-cyan-400/40 hover:text-cyan-400 bg-white/3'
              }`}
            >
              {isScanning ? `DECRYPTING: ${scanProgress.toFixed(0)}%` : 'RE-SCAN IDENTITY'}
            </button>

            {/* NASA Registry Table */}
            <div className="w-full space-y-3.5 border-t border-white/5 pt-5 text-[11px] text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">OPERATOR:</span>
                <span className="font-bold text-white text-glow-cyan">VIJAYAPANDIAN T</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ROLE:</span>
                <span className="text-cyan-400 font-bold">SOFTWARE ENGINEER</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  ACTIVE
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 whitespace-nowrap">EDUCATION:</span>
                <span className="text-right text-purple-300">B.E CSE (PRE-FINAL YEAR)</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 whitespace-nowrap">INSTITUTION:</span>
                <span className="text-right text-slate-200">SRM Easwari Engineering College</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">LOCATION:</span>
                <span className="text-slate-200">Chennai, Tamil Nadu</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">EMAIL:</span>
                <a href="mailto:vijayapandian112007@gmail.com" className="text-cyan-400 hover:underline">vijayapandian112007@gmail.com</a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CONTACT:</span>
                <a href="tel:+918610554060" className="text-slate-200 hover:text-white">+91 8610554060</a>
              </div>
            </div>
          </motion.div>

          {/* Card: Live Status Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass-card border border-white/5 rounded-2xl p-5 relative overflow-hidden"
          >
            <h3 className="text-xs text-cyan-400 font-bold border-b border-white/10 pb-2.5 mb-4 tracking-wider flex items-center gap-2">
              <Radar size={14} className="text-cyan-400 animate-pulse" />
              📡 LIVE SYSTEM TELEMETRY
            </h3>
            
            <div className="space-y-3.5 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-cyan-950/15 border border-cyan-500/10">
                <span className="text-slate-400">NETWORK NODE:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  🟢 ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-purple-950/10 border border-purple-500/5">
                <span className="text-slate-400">CURRENT OPERATION:</span>
                <span className="text-purple-400 font-bold animate-pulse">🚀 BUILDING PROJECTS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-pink-950/10 border border-pink-500/5">
                <span className="text-slate-400">RESEARCH INDEX:</span>
                <span className="text-pink-400 font-bold">📚 LEARNING TECHS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-950/15 border border-blue-500/10">
                <span className="text-slate-400">RECRUITMENT:</span>
                <span className="text-blue-400 font-bold text-glow-cyan">⭐ OPEN TO INQUIRIES</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-emerald-950/10 border border-emerald-500/5">
                <span className="text-slate-400">COLLABORATION:</span>
                <span className="text-emerald-400 font-bold">🤝 AVAILABLE FOR TEAM</span>
              </div>
            </div>
          </motion.div>

          {/* Card: Command Links */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-glass-card border border-white/5 rounded-2xl p-5"
          >
            <h3 className="text-xs text-purple-400 font-bold border-b border-white/10 pb-2.5 mb-4 tracking-wider flex items-center gap-2">
              <Network size={14} className="text-purple-400" />
              🌐 HUD COMMAND EXTERNAL LINKS
            </h3>

            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {[
                { name: 'GitHub', icon: '🐙', url: 'https://github.com/VIJAYAPANDIANT', color: 'hover:text-white hover:border-white/30 hover:bg-white/5' },
                { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/vijayapandian-t/', color: 'hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-950/20' },
                { name: 'LeetCode', icon: '🧠', url: 'https://leetcode.com/u/hackervj18/', color: 'hover:text-[#ffa116] hover:border-[#ffa116]/30 hover:bg-amber-950/20' },
                { name: 'HackerRank', icon: '🏅', url: 'https://www.hackerrank.com/profile/vijayapandian111', color: 'hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-950/20' },
                { name: 'GeeksforGeeks', icon: '📚', url: 'https://www.geeksforgeeks.org/profile/vijayapandiant11', color: 'hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-950/20' },
                { name: 'CodeChef', icon: '🏆', url: 'https://www.codechef.com/users/vijay_code07', color: 'hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-950/20' },
                { name: 'Portfolio', icon: '🌍', url: 'https://vijayapandian-t-portfolio.vercel.app/', color: 'hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-950/20' },
                { name: 'Download Resume', icon: '📄', url: 'https://drive.google.com/file/d/19Jxhh-z0wC_gVPZ85XuRgP-YXpyGtFBN/view?usp=sharing', color: 'hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-950/20', isAction: true },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target={link.url !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  onMouseEnter={playHover}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border border-white/5 bg-slate-950/60 transition-all duration-200 cursor-pointer ${link.color}`}
                >
                  <span className="text-xs">{link.icon}</span>
                  <span className="font-bold truncate">{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ================= COLUMN 2: OPERATIONS PANEL (8 COLS) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Tabs header panel */}
          <div className="flex border-b border-white/5 gap-2 select-none">
            {[
              { id: 'status', label: 'SYSTEM OVERVIEW', icon: <Terminal size={14} /> },
              { id: 'specialization', label: 'SPECIALIZATION MATRIX', icon: <Layers size={14} /> },
              { id: 'radar', label: 'SKILLS RADAR', icon: <Radar size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id as any); }}
                className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400 font-bold bg-cyan-950/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── TAB CONTENT: SYSTEM OVERVIEW ─── */}
          <AnimatePresence mode="wait">
            {activeTab === 'status' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >


                {/* Career Mission objectives */}
                <div className="bg-glass-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
                    <h3 className="text-xs text-cyan-400 font-bold tracking-wider flex items-center gap-2">
                      <Activity size={14} />
                      🚀 ACTIVE CAREER MISSIONS & OBJECTIVES
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-950/30 border border-emerald-500/25 rounded text-emerald-400 font-bold tracking-widest animate-pulse">MISSION STATUS: ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {objectives.map((obj, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-slate-950/45 hover:border-cyan-500/25 hover:bg-slate-950/70 transition-all duration-200"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-neon-cyan animate-pulse" />
                        <span className="text-slate-200 text-[11px] font-bold font-mono tracking-wider">{obj.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '📜 CERTIFICATES', count: stats.courses, color: 'text-blue-400', glow: 'hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
                    { label: '🏆 HACKATHONS', count: stats.hackathons, color: 'text-orange-400', glow: 'hover:border-orange-500/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]' },
                    { label: '🥇 PLACEMENT WINS', count: stats.wins, color: 'text-amber-400', glow: 'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
                    { label: '💼 INTERNSHIPS', count: stats.internships, color: 'text-emerald-400', glow: 'hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
                    { label: '🎓 WORKSHOPS', count: stats.workshops, color: 'text-cyan-400', glow: 'hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
                    { label: '⚔️ COMPETITIONS', count: stats.competitions, color: 'text-red-400', glow: 'hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
                    { label: '🔰 SKILL BADGES', count: stats.badges, color: 'text-purple-400', glow: 'hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
                    { label: '💻 PROJECTS BUILT', count: stats.projects, color: 'text-white', glow: 'hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]' },
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={playHover}
                      className={`bg-glass-card border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${card.glow}`}
                    >
                      <span className="text-[9px] text-slate-500 tracking-wider font-bold">{card.label}</span>
                      <div className="flex justify-between items-baseline">
                        <span className={`text-3xl font-black ${card.color}`}>{card.count}</span>
                        <span className="text-[8px] text-slate-600 font-mono">RECORDED</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Featured Achievements list */}
                <div className="bg-glass-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <h3 className="text-xs text-purple-400 font-bold border-b border-white/10 pb-3 mb-5 tracking-wider flex items-center gap-2">
                    <Award size={14} />
                    🎖️ FEATURED HOLOGRAPHIC ACHIEVEMENTS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {featuredAchievements.map((item) => (
                      <motion.div
                        key={item.id}
                        onClick={() => { playClick(); setSelectedFeatured(selectedFeatured === item.id ? null : item.id); }}
                        onMouseEnter={playHover}
                        whileHover={{ y: -3 }}
                        className={`border rounded-xl p-4 cursor-pointer bg-slate-950/60 transition-all flex flex-col justify-between min-h-[140px] text-left relative ${
                          selectedFeatured === item.id 
                            ? 'bg-glass border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02]' 
                            : 'border-white/5 hover:border-white/10 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -translate-y-full hover:animate-[scan_1.5s_linear_infinite]" />
                        
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] text-slate-500 font-bold">{item.tag}</span>
                          <h4 className="text-[11px] font-bold text-white leading-tight">{item.title}</h4>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-4">
                          <span className={`text-[10px] font-bold ${item.accentColor}`}>{item.place}</span>
                          <span className="text-[9px] text-slate-500 bg-white/3 border border-white/5 px-1.5 py-0.5 rounded-md text-center">{item.badge}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Featured Details Expansion Card */}
                  <AnimatePresence>
                    {selectedFeatured && (() => {
                      const details = featuredAchievements.find(f => f.id === selectedFeatured);
                      if (!details) return null;
                      return (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-cyan-400 font-bold tracking-widest">{details.tag}</span>
                              <h4 className="text-sm font-black text-white mt-1 uppercase">{details.title}</h4>
                              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{details.description}</p>
                            </div>
                            <span className={`text-xs font-bold whitespace-nowrap bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-glow-cyan ${details.accentColor}`}>
                              {details.place}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                            <span className="text-[9px] text-slate-500 font-bold mr-1">SKILLS DEMONSTRATED:</span>
                            {details.skills.map((s, idx) => (
                              <span key={idx} className="text-[9px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ─── TAB CONTENT: SPECIALIZATION MATRIX ─── */}
            {activeTab === 'specialization' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  { title: 'Frontend Development', desc: 'Crafting responsive, high-fidelity user interfaces, CSS grid modules, micro-interactions, and component state architectures.', icon: '⚛️', color: 'hover:border-cyan-500/30' },
                  { title: 'Backend Development', desc: 'Designing secure application interfaces, RESTful API systems, business logics, file handling, and computational algorithms.', icon: '🔌', color: 'hover:border-blue-500/30' },
                  { title: 'Full Stack Development', desc: 'Deploying end-to-end full stack environments with dynamic database state binding and responsive design grids.', icon: '⚡', color: 'hover:border-purple-500/30' },
                  { title: 'Cloud Computing', desc: 'Structuring cloud infrastructure with Google Cloud Platform, setting VM engines, Kubernetes orchestration, and network routing configurations.', icon: '☁️', color: 'hover:border-indigo-500/30' },
                  { title: 'Artificial Intelligence', desc: 'Training statistical predictive models, model architectures, regression vectors, and deep learning algorithms with TensorFlow.', icon: '🧠', color: 'hover:border-pink-500/30' },
                  { title: 'Database Management', desc: 'Designing database schemes, relational structure models, query procedures, and Firebase real-time database indexing.', icon: '💾', color: 'hover:border-teal-500/30' },
                  { title: 'Problem Solving', desc: 'Analyzing algorithmic structures, time/space complexity optimization, competitive programming challenges, and recursive systems.', icon: '⚔️', color: 'hover:border-red-500/30' }
                ].map((spec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={playHover}
                    className={`bg-glass-card border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer ${spec.color}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -translate-y-full hover:animate-[scan_2s_linear_infinite]" />
                    
                    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                        {spec.icon}
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{spec.title}</h4>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-4 leading-relaxed flex-1">
                      {spec.desc}
                    </p>

                    <div className="mt-4 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>STATUS: CERTIFIED</span>
                      <span className="text-cyan-400">ACTIVE UNIT</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ─── TAB CONTENT: SKILLS RADAR ─── */}
            {activeTab === 'radar' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-glass-card border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
              >
                {/* SVG Radar graphic */}
                <div className="relative w-80 h-80 flex-shrink-0 flex items-center justify-center">
                  
                  {/* Radar Scanning Line Layer */}
                  <motion.div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    animate={{ rotate: radarRotating ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    style={{ originX: '50%', originY: '50%' }}
                  >
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {/* Sweeper radial line with glow */}
                      <line x1="150" y1="150" x2="150" y2="40" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="2.5" />
                      {/* Gradient cone scan sweep sector */}
                      <path d="M150 150 L150 40 A110 110 0 0 1 200 65 Z" fill="url(#radarSweepGrad)" opacity="0.4" />
                      
                      <defs>
                        <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Static Radar Mesh (Concentric circles, axes) */}
                  <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Background concentric circles */}
                    <circle cx="150" cy="150" r="110" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="150" cy="150" r="88" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
                    <circle cx="150" cy="150" r="66" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="150" cy="150" r="44" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
                    <circle cx="150" cy="150" r="22" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" />

                    {/* Crosshair lines */}
                    <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
                    <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
                    
                    {/* Diagonal axes */}
                    <line x1="58" y1="58" x2="242" y2="242" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="58" y1="242" x2="242" y2="58" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Skill points connecting polygon */}
                    <polygon
                      points={radarSkills.map(s => `${s.x},${s.y}`).join(' ')}
                      fill="rgba(139, 92, 246, 0.15)"
                      stroke="rgba(139, 92, 246, 0.5)"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Skill Interactive Nodes */}
                  <div className="absolute inset-0 z-20">
                    {radarSkills.map((skill, idx) => (
                      <div 
                        key={idx}
                        className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full group cursor-pointer"
                        style={{ left: `${(skill.x / 300) * 100}%`, top: `${(skill.y / 300) * 100}%` }}
                        onMouseEnter={playHover}
                        title={skill.name}
                      >
                        {/* Glow halo */}
                        <div className="absolute -inset-2 rounded-full bg-cyan-400/20 group-hover:bg-cyan-400/50 transition-colors animate-ping duration-1000" />
                        <div className="absolute -inset-1 rounded-full bg-cyan-500/40 group-hover:bg-cyan-500/80 transition-colors" />
                        <div className="relative w-2 h-2 rounded-full bg-white shadow-neon-cyan" />
                        
                        {/* Tooltip text bubble */}
                        <div className="hidden group-hover:flex absolute left-4 -top-3.5 bg-slate-950 border border-cyan-500/30 px-2 py-0.5 rounded text-[8px] whitespace-nowrap text-cyan-400 z-30 font-mono shadow-2xl">
                          {skill.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radar Details column */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                      <h4 className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Radar size={12} className="text-cyan-400" />
                        OPERATOR TECHNOLOGICAL COMPENDIUM
                      </h4>
                      
                      {/* Controller pause/play switch */}
                      <button 
                        onClick={() => { playClick(); setRadarRotating(!radarRotating); }}
                        className="text-[9px] border border-white/10 hover:border-cyan-500/30 bg-white/3 hover:text-cyan-400 px-2 py-0.5 rounded cursor-pointer"
                      >
                        {radarRotating ? 'PAUSE SCANNER' : 'ROTATE SCANNER'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                      An active scanning array mapping of the core technology competencies. Center nodes are mapped to relative capability vectors. Hover over coordinate pins to analyze node paths.
                    </p>

                    {/* Skill Categories list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                      {[
                        {
                          title: '🚀 Programming Languages',
                          skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C']
                        },
                        {
                          title: '🌐 Web Development & Backend',
                          skills: ['HTML', 'CSS', 'Bootstrap', 'TailwindCSS', 'React', 'Next.js', 'Node.js', 'Express.js', 'Spring Boot']
                        },
                        {
                          title: '🗄️ Database & Concepts',
                          skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Prisma', 'DBMS']
                        },
                        {
                          title: '🎨 UI / UX',
                          skills: ['Figma', 'WordPress', 'Canva']
                        },
                        {
                          title: '📊 Data Analytics [Basic]',
                          skills: ['Python', 'Excel', 'SQL']
                        },
                        {
                          title: '🛠 Tools & Technologies',
                          skills: ['Git', 'GitHub', 'GitLab', 'VS Code', 'Eclipse', 'IntelliJ IDEA']
                        }
                      ].map((cat, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl border border-white/5 bg-slate-950/45">
                          <h5 className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider border-b border-white/5 pb-1 select-none">
                            {cat.title}
                          </h5>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cat.skills.map((skill, sIdx) => (
                              <span 
                                key={sIdx} 
                                className="text-[9px] font-bold bg-white/3 border border-white/5 px-2 py-0.5 rounded text-slate-300 hover:border-cyan-500/25 hover:text-cyan-300 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 text-[9px] text-slate-500 flex justify-between">
                    <span>SECTOR STATUS: OPTIMAL</span>
                    <span>FREQUENCY STABILIZED // 8.2 GHz</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};
