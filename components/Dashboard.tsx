
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RECENT_SESSIONS, ENERGY_BLOCKS } from '../constants';
import { BlockType, SessionRecord } from '../types';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [aiTip] = useState<string>("El enfoque es la clave del éxito. ¡Hoy es un gran día para avanzar!");
  const [sessions, setSessions] = useState<SessionRecord[]>(RECENT_SESSIONS);
  const [summary, setSummary] = useState({
    totalTime: "32h 45m",
    topBlock: "Ejecución",
    completedBlocks: 42,
    avgDuration: "55 min"
  });

  const [filterType, setFilterType] = useState<string>('ALL'); // Filter state

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.fetchStats();
        console.log("Dashboard received data:", data); // Debug log
        if (data && Array.isArray(data.sessions) && data.summary) {
          setSessions(data.sessions);
          setSummary(data.summary);
        } else {
          console.warn("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }
    loadStats();
  }, []);

  const distributionData = [
    { name: 'Azul (Profundo)', value: 45, color: '#3b82f6' },
    { name: 'Verde (Creativo)', value: 25, color: '#10b981' },
    { name: 'Amarillo (Admin)', value: 15, color: '#f59e0b' },
    { name: 'Blanco (Descanso)', value: 15, color: '#94a3b8' },
  ];

  const weeklyData = [
    { name: 'Lun', prof: 6, creat: 3, admin: 2 },
    { name: 'Mar', prof: 8, creat: 1, admin: 3 },
    { name: 'Mié', prof: 4, creat: 4, admin: 1 },
    { name: 'Jue', prof: 9, creat: 2, admin: 1 },
    { name: 'Vie', prof: 3, creat: 3, admin: 3 },
    { name: 'Sáb', prof: 1, creat: 2, admin: 0 },
    { name: 'Dom', prof: 0, creat: 1, admin: 0 },
  ];

  const getBlockStyles = (type: BlockType) => {
    const block = ENERGY_BLOCKS.find(b => b.id === type);
    return block || ENERGY_BLOCKS[2];
  };

  // Filter sessions
  const filteredSessions = sessions.filter(s => filterType === 'ALL' || s.type === filterType);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-5 md:px-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#ced7e8] dark:border-gray-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0d121c] dark:text-white">Estadísticas de Uso</h1>
          <p className="text-[#49659c] dark:text-gray-400 text-sm mt-1">Analiza tu rendimiento y distribución de energía.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-[#1a202c] p-1 rounded-lg border border-[#ced7e8] dark:border-gray-700 shadow-sm">
          <button className="px-4 py-1.5 rounded text-sm font-medium transition-all bg-[#e7ebf4] text-[#0d121c] dark:bg-gray-700 dark:text-white shadow-sm">Semanal</button>
          <button className="px-4 py-1.5 rounded text-sm font-medium text-[#49659c] dark:text-gray-400 hover:bg-[#f5f6f8] dark:hover:bg-gray-800 transition-all">Mensual</button>
          <button className="px-4 py-1.5 rounded text-sm font-medium text-[#49659c] dark:text-gray-400 hover:bg-[#f5f6f8] dark:hover:bg-gray-800 transition-all">Anual</button>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-10 flex flex-col gap-6 max-w-[1400px] mx-auto w-full pt-6">

        {/* AI Focus Coach Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-white animate-pulse">auto_awesome</span>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Focus Coach</h4>
              <p className="text-lg md:text-xl font-medium leading-relaxed italic">
                "{aiTip}"
              </p>
            </div>
          </div>
          {/* Decorative Background Icons */}
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[120px] opacity-10 rotate-12 select-none">bolt</span>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="schedule" label="Tiempo Total de Foco" value={summary.totalTime} trend="+12%" />
          <StatCard icon="psychology" label="Bloque Predominante" value={summary.topBlock} badgeColor="bg-blue-500" />
          <StatCard icon="check_circle" label="Bloques Completados" value={summary.completedBlocks.toString()} trend="+8%" />
          <StatCard icon="timer" label="Promedio por Bloque" value={summary.avgDuration} />
        </div>

        {/* ... Charts Section (will keep static for now or calculate from sessions) ... */}

        {/* Sessions Table */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#ced7e8] dark:border-gray-800 p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0d121c] dark:text-white">Detalle de Sesiones</h3>
              <p className="text-sm text-[#49659c] dark:text-gray-400">Historial reciente de bloques completados.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Filter Dropdown */}
              <select
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-[#ced7e8] dark:border-gray-600 rounded-lg text-sm font-medium text-[#0d121c] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Todos los Tipos</option>
                <option value={BlockType.REGULAR}>Regular</option>
                <option value={BlockType.ESTRATEGIA}>Estrategia</option>
                <option value={BlockType.EJECUCION}>Ejecución</option>
                <option value={BlockType.MECANICA}>Mecánica</option>
              </select>

              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-[#ced7e8] dark:border-gray-600 rounded-lg text-sm font-medium text-[#0d121c] dark:text-white hover:bg-[#f5f6f8] dark:hover:bg-gray-600 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">download</span> Exportar Informe
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ced7e8] dark:border-gray-700">
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[#49659c]">Tipo</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[#49659c]">Categoría</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[#49659c]">Duración</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[#49659c]">Eficiencia</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[#49659c] text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4fa] dark:divide-gray-800">
                {filteredSessions.map((session) => {
                  const style = getBlockStyles(session.type);
                  return (
                    <tr key={session.id} className="group hover:bg-[#f8f9fc] dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded ${style.bgColor} flex items-center justify-center text-white shadow-sm`}>
                            <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                          </div>
                          <span className="text-sm font-medium text-[#0d121c] dark:text-white">{style.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#49659c] dark:text-gray-400">{session.category}</td>
                      <td className="py-3 px-4 text-sm font-medium text-[#0d121c] dark:text-white">{session.duration} min</td>
                      <td className="py-3 px-4">
                        {session.efficiency > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${session.efficiency}%` }} />
                            </div>
                            <span className="text-xs font-medium text-green-600">{session.efficiency}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#49659c] dark:text-gray-400 text-right">{session.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: string; trend?: string; badgeColor?: string }> = ({
  icon, label, value, trend, badgeColor
}) => (
  <div className="flex flex-col justify-between p-5 bg-white dark:bg-[#1a202c] rounded-xl border border-[#ced7e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${badgeColor || 'bg-primary/10 text-primary'}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      {trend && (
        <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">trending_up</span> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[#49659c] dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-[#0d121c] dark:text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
