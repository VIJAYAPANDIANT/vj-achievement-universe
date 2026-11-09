import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Compass } from 'lucide-react';
import { achievementsData } from '../data/achievementsData';
import { playHover } from '../utils/sounds';

export const Analytics: React.FC = () => {
  // 1. Compute dynamic totals
  const stats = useMemo(() => {
    const counts = {
      Courses: 0,
      Internships: 0,
      Hackathons: 0,
      Workshops: 0,
      Competitions: 0,
      Badges: 0,
      total: achievementsData.length,
    };

    achievementsData.forEach((a) => {
      if (counts[a.category as keyof typeof counts] !== undefined) {
        counts[a.category as keyof typeof counts]++;
      }
    });

    return counts;
  }, []);

  // 2. Compute category proportions for Pie Chart
  const pieData = useMemo(() => {
    return [
      { name: 'Courses', value: stats.Courses, color: '#3b82f6' },
      { name: 'Internships', value: stats.Internships, color: '#10b981' },
      { name: 'Hackathons', value: stats.Hackathons, color: '#f97316' },
      { name: 'Workshops', value: stats.Workshops, color: '#06b6d4' },
      { name: 'Competitions', value: stats.Competitions, color: '#ef4444' },
      { name: 'Badges', value: stats.Badges, color: '#a855f7' },
    ];
  }, [stats]);

  // 3. Compute cumulative growth curve (by year-month)
  const growthData = useMemo(() => {
    // Sort items chronologically oldest first
    const sorted = [...achievementsData].sort(
      (a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
    );

    const countsByDate: { [key: string]: number } = {};
    sorted.forEach((item) => {
      const date = new Date(item.issueDate);
      // Format as YYYY-MM
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      countsByDate[key] = (countsByDate[key] || 0) + 1;
    });

    // Sort month keys
    const sortedMonths = Object.keys(countsByDate).sort();
    let cumulative = 0;
    
    return sortedMonths.map((month) => {
      cumulative += countsByDate[month];
      // Format month for chart label (e.g., "Jan 24")
      const [year, mNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${monthNames[parseInt(mNum) - 1]} ${year.slice(2)}`;
      
      return {
        month: label,
        cumulative,
        count: countsByDate[month],
      };
    });
  }, []);

  // 4. Compute top skills strengths for Radar Chart
  const radarData = useMemo(() => {
    const skillCounts: { [key: string]: number } = {};
    achievementsData.forEach((a) => {
      a.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    // Select top 6 skills
    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Normalize value on a 0-100 scale (max count = 100)
    const maxCount = sortedSkills.length > 0 ? sortedSkills[0][1] : 1;

    return sortedSkills.map(([skill, count]) => ({
      subject: skill,
      value: Math.round((count / maxCount) * 80 + 20), // Range 20-100 for visual neatness
    }));
  }, []);

  // Custom PolarAngleAxis tick formatter to wrap long labels (e.g. "Artificial Intelligence") on mobile
  const renderRadarTick = (props: any) => {
    const { x, y, textAnchor, payload } = props;
    const value: string = payload?.value || '';

    const words = value.split(' ');
    if (value.length > 10 && words.length > 1) {
      let line1 = words[0];
      let line2 = words.slice(1).join(' ');
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        line1 = words.slice(0, mid).join(' ');
        line2 = words.slice(mid).join(' ');
      }
      return (
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          fill="rgba(255,255,255,0.6)"
          fontSize={8}
          fontFamily="monospace"
        >
          <tspan x={x} dy="-0.25em">{line1}</tspan>
          <tspan x={x} dy="1.15em">{line2}</tspan>
        </text>
      );
    }

    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="rgba(255,255,255,0.6)"
        fontSize={8}
        fontFamily="monospace"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-140px)] flex flex-col z-10 select-none">
      {/* Header Telemetry */}
      <div className="flex flex-col border-l border-cyan-500/30 pl-4 py-1 mb-8">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Decryption Console Active</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-1">
          ACHIEVEMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">ANALYTICS</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          A dynamic diagnostics panel measuring certification volumes, category ratios, and competency metrics.
        </p>
      </div>

      {/* Numeric KPI cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {[
          { label: 'COURSES', count: stats.Courses, color: 'text-blue-400', icon: '📚' },
          { label: 'INTERNSHIPS', count: stats.Internships, color: 'text-emerald-400', icon: '💼' },
          { label: 'HACKATHONS', count: stats.Hackathons, color: 'text-orange-400', icon: '🏆' },
          { label: 'WORKSHOPS', count: stats.Workshops, color: 'text-cyan-400', icon: '🎓' },
          { label: 'COMPETITIONS', count: stats.Competitions, color: 'text-red-400', icon: '⚔' },
          { label: 'BADGES', count: stats.Badges, color: 'text-purple-400', icon: '🔰' },
          { label: 'TOTAL CORE', count: stats.total, color: 'text-white', icon: '⚡', isTotal: true },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onMouseEnter={playHover}
            className={`bg-glass border border-white/5 p-4 rounded-xl flex flex-col justify-between h-24 ${
              kpi.isTotal ? 'bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border-cyan-500/20 shadow-neon-cyan' : ''
            }`}
          >
            <div className="flex justify-between items-start text-slate-500 font-mono text-[9px] uppercase tracking-wider">
              <span>{kpi.label}</span>
              <span>{kpi.icon}</span>
            </div>
            <div className={`text-2xl font-bold font-mono tracking-tight ${kpi.color}`}>
              {kpi.count}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphical Dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Line chart (Span 2) */}
        <div className="lg:col-span-2 bg-glass border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4 font-mono text-xs font-bold text-cyan-400 select-none">
            <TrendingUp size={14} /> ACHIEVEMENT_GROWTH_CURVE
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 4, 15, 0.9)',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#06b6d4', stroke: '#030014', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#d946ef', stroke: '#fff', strokeWidth: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie chart */}
        <div className="lg:col-span-1 bg-glass border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4 font-mono text-xs font-bold text-cyan-400 select-none">
            <BarChart3 size={14} /> CATEGORY_PROPORTION_MATRIX
          </div>
          <div className="h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 4, 15, 0.9)',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total count center label */}
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">TOTAL</span>
              <span className="text-2xl font-bold text-white leading-none mt-1">{stats.total}</span>
            </div>
          </div>

          {/* Chart Legenda */}
          <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-slate-400 pt-2 select-none">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competencies Radar chart */}
        <div className="lg:col-span-3 bg-glass border border-white/5 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4 font-mono text-xs font-bold text-cyan-400 select-none">
            <Compass size={14} /> SKILL_COMPASS_INDEX
          </div>
          {radarData.length > 0 ? (
            <div className="h-[230px] sm:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="55%" data={radarData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={renderRadarTick}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skill Match"
                    dataKey="value"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center text-slate-500 font-mono text-xs h-[230px]">
              NO SKILLS TELEMETRY INDEXED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
