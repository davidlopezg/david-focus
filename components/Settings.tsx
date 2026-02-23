
import React from 'react';
import { EnergyBlock, ActiveBreak } from '../types';
import { SupabaseConfig } from '../services/api';

interface SettingsProps {
    blocks: EnergyBlock[];
    onUpdateBlock: (updatedBlock: EnergyBlock) => void;
    activeBreaks: ActiveBreak[];
    onUpdateBreak: (updatedBreak: ActiveBreak) => void;
    supabaseConfig: SupabaseConfig;
    onUpdateSupabaseConfig: (config: SupabaseConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({
    blocks,
    onUpdateBlock,
    activeBreaks,
    onUpdateBreak,
    supabaseConfig,
    onUpdateSupabaseConfig
}) => {
    return (
        <div className="h-full overflow-y-auto px-6 py-8 md:px-10 lg:px-20 bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-[#0d121c] dark:text-white text-3xl font-black mb-2">Configuración</h1>
                    <p className="text-[#49659c] dark:text-gray-400">Personaliza tus bloques de energía, pausas activas y la conexión con Supabase.</p>
                </div>

                {/* Supabase Connection Section */}
                <div className="p-6 rounded-2xl bg-[#f0f4fa] dark:bg-gray-800/50 border border-primary/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl">database</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">bolt</span>
                        Conexión Supabase
                    </h2>
                    <div className="grid gap-4 md:grid-cols-1">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Project URL</label>
                            <input
                                type="text"
                                placeholder="https://xyz.supabase.co"
                                value={supabaseConfig.url}
                                onChange={(e) => onUpdateSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                                className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Anon Key (API Key)</label>
                            <input
                                type="password"
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                value={supabaseConfig.anonKey}
                                onChange={(e) => onUpdateSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                                className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Energy Blocks Section */}
                <div>
                    <h2 className="text-xl font-bold text-[#0d121c] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">view_agenda</span>
                        Bloques de Energía
                    </h2>
                    <div className="grid gap-6">
                        {blocks.map((block) => (
                            <div
                                key={block.id}
                                className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#ced7e8] dark:border-gray-800 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${block.bgColor} ${block.textColor}`}>
                                        <span className="material-symbols-outlined text-2xl">{block.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0d121c] dark:text-white">{block.title}</h3>
                                        <p className="text-xs text-[#49659c] dark:text-gray-400">ID: {block.id}</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Nombre del Bloque</label>
                                        <input
                                            type="text"
                                            value={block.title}
                                            onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Duración (minutos)</label>
                                        <input
                                            type="number"
                                            value={block.defaultDuration}
                                            onChange={(e) => onUpdateBlock({ ...block, defaultDuration: parseInt(e.target.value) || 0 })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Descripción</label>
                                        <textarea
                                            value={block.description}
                                            onChange={(e) => onUpdateBlock({ ...block, description: e.target.value })}
                                            rows={2}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Breaks Section */}
                <div>
                    <h2 className="text-xl font-bold text-[#0d121c] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">free_breakfast</span>
                        Pausas Activas
                    </h2>
                    <div className="grid gap-6">
                        {activeBreaks.map((breakItem) => (
                            <div
                                key={breakItem.id}
                                className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#ced7e8] dark:border-gray-800 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${breakItem.color} text-white`}>
                                        <span className="material-symbols-outlined text-2xl">{breakItem.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0d121c] dark:text-white">{breakItem.title}</h3>
                                        <p className="text-xs text-[#49659c] dark:text-gray-400">ID: {breakItem.id}</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Título</label>
                                        <input
                                            type="text"
                                            value={breakItem.title}
                                            onChange={(e) => onUpdateBreak({ ...breakItem, title: e.target.value })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Duración (minutos)</label>
                                        <input
                                            type="number"
                                            value={breakItem.defaultDuration}
                                            onChange={(e) => onUpdateBreak({ ...breakItem, defaultDuration: parseInt(e.target.value) || 0 })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Subtítulo</label>
                                        <input
                                            type="text"
                                            value={breakItem.subtitle}
                                            onChange={(e) => onUpdateBreak({ ...breakItem, subtitle: e.target.value })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Placeholder</label>
                                        <input
                                            type="text"
                                            value={breakItem.placeholder}
                                            onChange={(e) => onUpdateBreak({ ...breakItem, placeholder: e.target.value })}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-wider">Descripción</label>
                                        <textarea
                                            value={breakItem.description}
                                            onChange={(e) => onUpdateBreak({ ...breakItem, description: e.target.value })}
                                            rows={2}
                                            className="px-4 py-2.5 rounded-lg border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
