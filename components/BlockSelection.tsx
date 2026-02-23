
import React from 'react';
import { BlockType, ActiveBreakType, EnergyBlock, ActiveBreak } from '../types';

interface BlockSelectionProps {
  blocks: EnergyBlock[];
  activeBreaks: ActiveBreak[];
  onSelect: (type: BlockType) => void;
  onSelectBreak: (type: ActiveBreakType) => void;
}

const BlockSelection: React.FC<BlockSelectionProps> = ({ blocks, activeBreaks, onSelect, onSelectBreak }) => {
  return (
    <div className="h-full overflow-y-auto px-6 py-8 md:px-10 lg:px-20 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-[#0d121c] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Define tu Enfoque
          </h1>
          <p className="text-[#49659c] dark:text-gray-400 text-lg md:text-xl font-normal max-w-2xl">
            Escucha a tu cuerpo y mente. Selecciona el bloque de energía que mejor se adapte a tu estado actual para maximizar tu productividad.
          </p>
        </div>

        {/* Energy Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => onSelect(block.id)}
              className={`group relative flex flex-col items-start justify-between p-6 h-64 w-full rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden text-left border-2 ${block.id === BlockType.ESTRATEGIA
                ? 'border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b]'
                : `border-transparent ${block.bgColor}`
                }`}
            >
              <span className={`material-symbols-outlined absolute -right-6 -bottom-6 text-[180px] opacity-10 group-hover:scale-110 transition-transform duration-500 ${block.textColor}`}>
                {block.icon}
              </span>

              <div className={`p-3 rounded-xl backdrop-blur-sm ${block.id === BlockType.ESTRATEGIA
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white'
                : 'bg-white/20 text-white'
                }`}>
                <span className="material-symbols-outlined text-3xl">{block.icon}</span>
              </div>

              <div className="z-10 mt-auto">
                <h3 className={`text-2xl font-bold mb-1 ${block.textColor}`}>{block.title}</h3>
                <p className={`text-sm font-medium leading-relaxed opacity-90 ${block.id === BlockType.ESTRATEGIA ? 'text-slate-500 dark:text-slate-400' : 'text-white/80'}`}>
                  {block.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Breaks Section */}
        <div className="flex flex-col gap-4 w-full mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-3 mb-1 px-1">
            <h2 className="text-[#0d121c] dark:text-white text-xl font-bold">Pausas Activas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {activeBreaks.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectBreak(item.id)}
                className="group flex flex-row md:flex-col items-center justify-start md:justify-center gap-3 p-4 h-auto md:h-36 rounded-xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`p-3 rounded-full group-hover:scale-110 transition-transform duration-300 ${item.color.replace('bg-', 'bg-opacity-10 text-')} ${item.color.replace('bg-', 'dark:bg-opacity-20 ')}`}>
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </div>
                <div className="text-left md:text-center">
                  <span className="block font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base mb-0.5">{item.id === ActiveBreakType.CUSTOM ? 'Personalizada' : item.title}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium">{item.defaultDuration} min</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockSelection;
