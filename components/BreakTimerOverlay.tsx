
import React, { useState, useEffect, useRef } from 'react';
import { ActiveBreak, ActiveBreakType } from '../types';
import { api } from '../services/api';

interface BreakTimerOverlayProps {
  activeBreak: ActiveBreak;
  onClose: () => void;
}

const BreakTimerOverlay: React.FC<BreakTimerOverlayProps> = ({ activeBreak, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
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

      // Record break to n8n
      // Record break to n8n
      api.recordBreak({
        type: activeBreak.id,
        title: activeBreak.title,
        duration: 5 // Default break duration
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

  const adjustTime = (amount: number) => {
    setTimeLeft((prev) => Math.max(0, prev + amount * 60));
  };

  const isWater = activeBreak.id === ActiveBreakType.WATER;
  const isCustom = activeBreak.id === ActiveBreakType.CUSTOM;
  const progress = (timeLeft / (5 * 60)) * 100;

  if (isFinished) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center ${activeBreak.bgColor}`}>
        <div className={`size-24 rounded-full ${activeBreak.color} flex items-center justify-center mb-6 text-white animate-bounce`}>
          <span className="material-symbols-outlined text-5xl">done_all</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Pausa completada</h2>
        <p className="text-slate-500 mb-8 max-w-xs">¡Excelente! Has recuperado energía. ¿Listo para volver al trabajo?</p>
        <button
          onClick={onClose}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg ${activeBreak.color}`}
        >
          Volver a la selección
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center transition-colors duration-500 ${activeBreak.bgColor} overflow-y-auto`}>
      {/* Header matching the screenshots */}
      <header className="w-full h-20 px-6 flex items-center justify-between border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`size-8 rounded-lg ${activeBreak.color} flex items-center justify-center text-white shadow-sm`}>
            <span className="material-symbols-outlined text-xl">dataset</span>
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">EnergyBlocks</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Historial', 'Configuración'].map(item => (
            <span key={item} className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
        <div className="size-10 rounded-full bg-orange-200 border-4 border-white shadow-sm shrink-0"></div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center pt-12 pb-20 px-6">
        {/* Activity Icon Circle */}
        <div className={`size-20 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white mb-8 transition-transform duration-500 hover:scale-105 ${activeBreak.color.replace('bg-', 'text-')}`}>
          <span className="material-symbols-outlined text-4xl">{activeBreak.icon}</span>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">{activeBreak.subtitle}</p>
          {isCustom ? (
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Escribe tu actividad.."
              className="text-4xl md:text-5xl font-black text-slate-900 bg-transparent border-none text-center focus:ring-0 placeholder-slate-200 w-full max-w-lg"
            />
          ) : (
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              {activeBreak.title}
            </h1>
          )}
          <p className="text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed">
            {activeBreak.description}
          </p>
        </div>

        {/* Central Card */}
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center relative border border-white">
          {/* Water specific circular progress */}
          {isWater && (
            <div className="absolute inset-0 pointer-events-none p-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none" stroke="#e0f2fe" strokeWidth="2"
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none" stroke="#0ea5e9" strokeWidth="2"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          )}

          <div className="flex flex-col items-center gap-1 mb-8 z-10">
            <div className="text-7xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter tabular-nums font-mono leading-none">
              {formatTime(timeLeft)}
            </div>
            {!isWater && <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">minutos</div>}
            {isWater && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">minutos</div>}
          </div>

          {/* Minute Adjuster */}
          <div className="flex items-center gap-6 mb-10 z-10">
            <button
              onClick={() => adjustTime(-1)}
              className="size-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-xl font-bold">remove</span>
            </button>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hidden md:block">minutos</span>
            <button
              onClick={() => adjustTime(1)}
              className="size-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-xl font-bold">add</span>
            </button>
          </div>

          {/* Activity Placeholder / Note */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-8 z-10 border border-slate-100">
            <span className="material-symbols-outlined text-slate-300 text-xl">notes</span>
            <span className="text-sm font-medium text-slate-400">{activeBreak.placeholder || "Añadir descripción..."}</span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-lg shadow-xl shadow-opacity-20 transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-md ${activeBreak.color} z-10`}
          >
            <span className="material-symbols-outlined fill-icon text-2xl">{isRunning ? 'pause' : 'play_arrow'}</span>
            {isRunning ? 'Pausar' : 'Iniciar Pausa'}
          </button>

          {!isWater && (
            <button
              onClick={onClose}
              className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              Cambiar Bloque
            </button>
          )}
        </div>

        {/* Quote / Footer navigation */}
        <div className="mt-12 text-center">
          {activeBreak.id === ActiveBreakType.WALK ? (
            <p className="text-emerald-500/60 font-medium italic">"Caminar es la mejor medicina del hombre." — Hipócrates</p>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              {activeBreak.id === ActiveBreakType.EYES ? 'Volver a la selección' : activeBreak.id === ActiveBreakType.CUSTOM ? 'Cancelar' : 'Cancelar y volver'}
            </button>
          )}
        </div>
      </main>

      <footer className="w-full py-10 flex flex-col items-center gap-6 mt-auto border-t border-black/5">
        <div className="flex gap-8">
          {['Privacidad', 'Términos', 'Ayuda'].map(item => (
            <span key={item} className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2024 EnergyBlocks App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default BreakTimerOverlay;
