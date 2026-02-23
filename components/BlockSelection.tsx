
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
    <div className="h-full overflow-y-auto px-4 py-6 md:px-8 lg:px-12 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Title Section */}
        <div className="flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-[#0d121c] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            ¿Cuál es tu nivel de energía?
          </h1>
          <p className="text-[#49659c] dark:text-gray-400 text-sm md:text-base max-w-lg">
            Selecciona tu foco de trabajo
          </p>
        </div>

        {/* Energy Blocks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => onSelect(block.id)}
              className={`group relative flex flex-col items-start justify-between p-4 md:p-5 h-40 md:h-44 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden text-left border-2 border-transparent hover:border-primary/30 ${block.bgColor}`}
            >
              <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-15 group-hover:scale-110 transition-transform duration-500 ${block.textColor}`}>
                {block.icon}
              </span>

              <div className={`p-2 rounded-lg backdrop-blur-sm bg-white/20 text-white`}>
                <span className="material-symbols-outlined text-xl">{block.icon}</span>
              </div>

              <div className="z-10">
                <h3 className={`text-lg md:text-xl font-bold mb-0.5 ${block.textColor}`}>{block.title}</h3>
                <p className={`text-xs md:text-sm font-medium opacity-90 ${block.textColor}`}>
                  {block.defaultDuration} min
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Breaks Section */}
        <div className="flex flex-col gap-3 w-full mt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-3 px-1">
            <h2 className="text-[#0d121c] dark:text-white text-lg font-bold">Toma un respiro</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">BREAK</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activeBreaks.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectBreak(item.id)}
                className="group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`p-2.5 rounded-full ${item.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-gray-800 dark:text-gray-100 text-sm">{item.id === ActiveBreakType.CUSTOM ? 'Custom' : item.title}</span>
                  <span className="block text-xs text-primary font-bold mt-0.5">{item.defaultDuration} min</span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-lg">play_arrow</span>
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
