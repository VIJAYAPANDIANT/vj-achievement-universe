import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Calendar, Cpu, Link, Award, CheckCircle } from 'lucide-react';
import type { Achievement } from '../data/achievementsData';
import { playClick, playScan, playUnlock } from '../utils/sounds';
import { formatDateWithMonth } from '../utils/date';

interface CertificateModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ achievement, onClose }) => {
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'hologram' | 'scan'>('hologram');

  useEffect(() => {
    if (!achievement) return;
    
    setIsDecrypting(true);
    setProgress(0);
    setViewMode(achievement.image ? 'scan' : 'hologram');
    playScan();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecrypting(false);
          playUnlock();
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [achievement]);

  if (!achievement) return null;


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { playClick(); onClose(); }}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Outer Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl bg-glass border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] z-10"
        >
          {/* Top Panel HUD */}
          <div className="flex justify-between items-center px-6 py-4 bg-black/40 border-b border-white/5">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Cpu className="text-cyan-400 animate-spin-slow" size={14} />
              <span className="text-slate-400">DATABASE RESOURCE / ID: </span>
              <span className="text-cyan-400 font-bold">{achievement.id.toUpperCase()}</span>
            </div>
            <button
              onClick={() => { playClick(); onClose(); }}
              className="p-1.5 rounded-md border border-white/5 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
            {/* Decrypting Scanning Screen OR Certificate Visualizer */}
            <div className={`lg:col-span-2 bg-[#05040f] p-6 flex items-center justify-center relative min-h-[350px] border-b lg:border-b-0 lg:border-r border-white/5 ${
              isDecrypting ? 'scanline' : ''
            }`}>
              <AnimatePresence mode="wait">
                {isDecrypting ? (
                  <motion.div
                    key="decrypting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center font-mono w-full max-w-sm"
                  >
                    <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
                      <div className="absolute inset-2 rounded-full border border-cyan-500/30 animate-pulse" />
                      <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
                        <Cpu className="text-cyan-400 animate-spin" size={18} />
                      </div>
                    </div>
                    <div className="text-xs text-cyan-400 mb-2 uppercase tracking-widest font-bold">Decrypting Secure Vault Data</div>
                    
                    {/* Progress indicator */}
                    <div className="w-full bg-slate-950 border border-white/10 rounded-full h-2 overflow-hidden mb-3">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 w-full flex justify-between">
                      <span>KEY_HASH: RSA_4096</span>
                      <span>{Math.min(progress, 100)}% COMPLETE</span>
                    </div>
                  </motion.div>
                ) : viewMode === 'scan' && achievement.image ? (
                  <motion.div
                    key="scan"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center border border-cyan-500/10 rounded-xl p-2 bg-[#04030d] relative overflow-hidden"
                  >
                    <img 
                      src={achievement.image} 
                      alt={achievement.title} 
                      className="max-h-[350px] md:max-h-[420px] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="certificate"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col justify-between border border-cyan-500/10 rounded-xl p-8 bg-gradient-to-br from-[#0c0926] via-[#04030d] to-[#0d0724] relative shadow-inner scanline"
                  >
                    {/* Corner decorative bracket lines */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40" />
                    
                    {/* Decrypt hologram scanner line overlay */}
                    <div className="absolute inset-0 hologram-scan pointer-events-none" />

                    {/* Certificate Crest and Issuer Title */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">SECURE VERIFIED ID</div>
                        <div className="text-lg font-bold text-white tracking-wide mt-1 uppercase font-mono">{achievement.issuer}</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-neon-cyan animate-pulse">
                        <Award size={24} />
                      </div>
                    </div>

                    {/* Main certificate body */}
                    <div className="my-8 text-center">
                      <span className="text-[11px] text-slate-400 font-mono uppercase tracking-widest block">This credential verifies that</span>
                      <h2 className="text-2xl font-bold text-white text-glow-cyan font-sans tracking-wide mt-3 my-2">
                        VIJAYAPANDIAN T
                      </h2>
                      <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto my-3" />
                      <span className="text-[11px] text-slate-400 font-mono uppercase tracking-widest block">has successfully completed the specialization/award for</span>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mt-2 font-mono uppercase">
                        {achievement.title}
                      </h3>
                    </div>

                    {/* Footer Credentials */}
                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                      <div className="flex flex-col font-mono text-[9px] text-slate-500">
                        <span>ISSUE DATE: {achievement.issueDate}</span>
                        <span>CREDENTIAL ID: {achievement.credentialId || 'N/A'}</span>
                        <span className="text-cyan-500/70 mt-1 uppercase">VERIFICATION ENGINE: SOLID_CHAIN_v1.0</span>
                      </div>
                      
                      {/* Interactive dynamic QR/Signature block */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border border-slate-700 bg-white/5 p-1 rounded flex items-center justify-center relative">
                          {/* Simulated mini digital QR code */}
                          <div className="w-full h-full opacity-40 bg-radial-[circle_at_center,#fff_0%,transparent_100%] hologram-grid" />
                          <div className="absolute inset-0 border border-cyan-500/20 animate-pulse" />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono mt-1">DIGITAL_SIG</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Achievement Telemetry Metadata Details */}
            <div className="bg-black/30 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Metadata HUD</span>
                <h3 className="text-xl font-extrabold text-white mt-1 uppercase tracking-wide">
                  {achievement.title}
                </h3>
                
                <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
                  <span className="px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 font-mono text-[10px] uppercase">
                    {achievement.category}
                  </span>
                  <span className="text-slate-500 font-mono">|</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {achievement.subCategory}
                  </span>
                </div>

                <p className="text-slate-300 text-xs mt-4 leading-relaxed font-sans border-l-2 border-purple-500/30 pl-3 py-1 bg-white/2 rounded-r-md">
                  {achievement.description}
                </p>

                {/* Info specifications */}
                <div className="mt-5 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-cyan-400" /> Issuer</span>
                    <span className="text-slate-200 text-right">{achievement.issuer}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-cyan-400" /> Issued Date</span>
                    <span className="text-slate-200">{formatDateWithMonth(achievement.issueDate)}</span>
                  </div>
                  {achievement.place && (
                    <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                      <span className="flex items-center gap-1.5"><Award size={13} className="text-cyan-400" /> Rank / Position</span>
                      <span className="text-slate-200 uppercase font-bold text-glow-cyan">{achievement.place}</span>
                    </div>
                  )}
                  {achievement.projectTitle && (
                    <div className="flex flex-col text-slate-400 border-b border-white/5 pb-1.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="flex items-center gap-1.5"><Cpu size={13} className="text-cyan-400" /> Project Title</span>
                        <span className="text-slate-200">{achievement.projectTitle}</span>
                      </div>
                      {achievement.projectUrl && (
                        <a
                          href={achievement.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5 hover:underline cursor-pointer self-start"
                        >
                          <Link size={10} /> Github Repository
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Skill tags */}
                <div className="mt-5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2">Verified Skill Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {achievement.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-300 border border-slate-800 bg-slate-900/50 hover:border-cyan-500/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verify & Download credentials button */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                {achievement.image && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={achievement.image}
                    download={`${achievement.title.toLowerCase().replace(/\s+/g, '_')}_certificate`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold py-2 px-4 rounded-lg hover:bg-cyan-950/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    DOWNLOAD ORIGINAL SCAN
                  </motion.a>
                )}
                {achievement.url ? (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-[11px] font-bold py-2 px-4 rounded-lg shadow-neon-cyan transition-all border border-cyan-400/30 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    VERIFY ON OFFICIAL PORTAL
                  </motion.a>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-500 font-mono text-[10px] py-2 px-4 rounded-lg select-none">
                    NO ONLINE VERIFICATION REQUIRED
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
