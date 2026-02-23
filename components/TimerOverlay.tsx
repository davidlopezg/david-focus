
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EnergyBlock, BlockType } from '../types';
import { api } from '../services/api';

interface TimerOverlayProps {
  block: EnergyBlock;
  onClose: () => void;
}

const TimerOverlay: React.FC<TimerOverlayProps> = ({ block, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(block.defaultDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsFinished(true);
      if (timerRef.current) window.clearInterval(timerRef.current);

      // Record session to n8n
      // Record session to n8n
      api.recordSession({
        type: block.id,
        title: block.title,
        duration: Math.round((block.defaultDuration * 60 - timeLeft) / 60) || block.defaultDuration,
        task: task,
        efficiency: 100 // Default efficiency for completed blocks
      });
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = useCallback((amount: number) => {
    setTimeLeft((prev) => Math.max(0, prev + amount * 60));
  }, []);

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  // Determine special classes for "Estrategia" block to avoid white-on-white issues
  const isLightBlock = block.id === BlockType.ESTRATEGIA;

  // Use a darker slate for the Estrategia background to ensure contrast, or adapt to dark mode
  const mainBgClass = block.bgColor;
  const mainTextClass = block.textColor;

  if (isFinished) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-all duration-1000 ${mainBgClass} ${mainTextClass}`}>
        <div className="size-32 rounded-full bg-white/20 flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-6xl">celebration</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-4">¡Sesión Completada!</h2>
        <p className="text-xl opacity-80 max-w-md mb-12">Buen trabajo manteniendo tu energía en el bloque de {block.title}. Tómate un respiro antes de continuar.</p>
        <button
          onClick={onClose}
          className={`px-10 py-4 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105 ${isLightBlock ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
        >
          Volver al Tablero
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-500 ${mainBgClass} ${mainTextClass}`}>
      {/* Dynamic Background Effects */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl -z-10 pointer-events-none opacity-20 ${isLightBlock ? 'bg-slate-400' : 'bg-white'}`} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12 w-full z-10">
        <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity cursor-default">
          <span className="material-symbols-outlined text-xl">{block.icon}</span>
          <span className="text-sm md:text-base font-semibold tracking-wide uppercase">Bloque: {block.title} con Foco</span>
        </div>
        <button
          onClick={onClose}
          className={`flex items-center justify-center size-10 rounded-full transition-all backdrop-blur-sm group border ${isLightBlock ? 'bg-black/10 hover:bg-black/20 border-black/10' : 'bg-white/10 hover:bg-white/20 border-white/5'
            }`}
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">close</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 relative z-0">
        {/* Task Input */}
        <div className="w-full text-center mb-10 md:mb-16">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="¿Qué vas a hacer?"
            className={`w-full bg-transparent border-none text-center text-4xl md:text-6xl lg:text-7xl font-bold placeholder-current opacity-40 focus:opacity-100 resize-none overflow-hidden leading-tight p-0 m-0 focus:ring-0 transition-opacity`}
            rows={1}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <div className={`h-1.5 w-32 rounded-full mx-auto mt-6 ${isLightBlock ? 'bg-slate-300 dark:bg-slate-700' : 'bg-white/30'}`} />
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="relative group cursor-default">
            <div className={`text-[6rem] md:text-[10rem] leading-none font-bold tracking-tighter font-mono tabular-nums select-none drop-shadow-md`}>
              {formatTime(timeLeft)}
            </div>
            <div className="absolute -right-12 top-4 text-sm font-bold opacity-30 hidden md:block uppercase tracking-widest">min</div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => adjustTime(-5)}
              className={`flex items-center justify-center size-12 rounded-xl transition-all backdrop-blur-sm border active:scale-90 ${isLightBlock ? 'bg-black/5 hover:bg-black/10 border-black/10' : 'bg-white/10 hover:bg-white/20 border-white/10'
                }`}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <div className={`w-px h-8 ${isLightBlock ? 'bg-black/10' : 'bg-white/20'}`} />
            <button
              onClick={() => adjustTime(5)}
              className={`flex items-center justify-center size-12 rounded-xl transition-all backdrop-blur-sm border active:scale-90 ${isLightBlock ? 'bg-black/5 hover:bg-black/10 border-black/10' : 'bg-white/10 hover:bg-white/20 border-white/10'
                }`}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Start/Stop Button */}
        <div className="mt-4 md:mt-8 flex flex-col items-center">
          <button
            onClick={toggleTimer}
            className={`group relative flex items-center justify-center gap-4 px-16 py-6 rounded-full shadow-2xl active:shadow-md active:scale-[0.98] transition-all duration-300 hover:scale-105 ${isLightBlock
              ? 'bg-primary text-white hover:bg-blue-700'
              : 'bg-white text-primary hover:bg-gray-100'
              }`}
          >
            <span className="material-symbols-outlined fill-icon text-4xl transition-transform group-hover:scale-110">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span className="text-2xl font-black tracking-tight">
              {isRunning ? 'Pausar' : 'Empezar'}
            </span>
          </button>
          <div className="mt-8 flex items-center gap-2 opacity-40 font-bold uppercase tracking-[0.2em] text-xs">
            {isRunning && <span className="size-2 rounded-full bg-red-500 animate-ping"></span>}
            {isRunning ? 'Bloque en curso' : 'Listo para el despegue'}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center opacity-30 text-xs font-bold uppercase tracking-[0.4em] pointer-events-none">
        David Focus Protocol v1.0
      </footer>
    </div>
  );
};

export default TimerOverlay;
