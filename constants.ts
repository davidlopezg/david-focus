
import { BlockType, EnergyBlock, SessionRecord, ActiveBreakType, ActiveBreak } from './types';

export const ENERGY_BLOCKS: EnergyBlock[] = [
  {
    id: BlockType.REGULAR,
    title: 'Regular',
    description: 'Energía sostenible para el día a día. Ritmo constante.',
    colorClass: 'bg-emerald-500',
    icon: 'spa',
    bgColor: 'bg-emerald-500',
    textColor: 'text-white',
    defaultDuration: 25
  },
  {
    id: BlockType.ESTRATEGIA,
    title: 'Estrategia',
    description: 'Planificación y visión a largo plazo. Mente clara.',
    colorClass: 'bg-white dark:bg-[#1e293b]',
    icon: 'lightbulb',
    bgColor: 'bg-slate-200 dark:bg-slate-800',
    textColor: 'text-slate-900 dark:text-white',
    defaultDuration: 45
  },
  {
    id: BlockType.EJECUCION,
    title: 'Ejecución',
    description: 'Alta intensidad y foco profundo. Tareas críticas.',
    colorClass: 'bg-primary',
    icon: 'bolt',
    bgColor: 'bg-primary',
    textColor: 'text-white',
    defaultDuration: 90
  },
  {
    id: BlockType.MECANICA,
    title: 'Mecánica',
    description: 'Tareas repetitivas y mantenimiento. Baja carga mental.',
    colorClass: 'bg-amber-400',
    icon: 'build',
    bgColor: 'bg-amber-400',
    textColor: 'text-amber-950',
    defaultDuration: 20
  }
];

export const ACTIVE_BREAKS: ActiveBreak[] = [
  {
    id: ActiveBreakType.WALK,
    title: 'Pasear',
    subtitle: 'PAUSA ACTIVA',
    description: 'Desconecta y muévete para recargar energía.',
    icon: 'directions_walk',
    color: 'bg-emerald-500',
    bgColor: 'bg-[#f0faf5]',
    placeholder: 'Ej. Dar una vuelta a la manzana...',
    defaultDuration: 5
  },
  {
    id: ActiveBreakType.WATER,
    title: 'Beber Agua',
    subtitle: 'HIDRATACIÓN',
    description: 'Hidratación rápida para recuperar energía',
    icon: 'water_drop',
    color: 'bg-[#0ea5e9]',
    bgColor: 'bg-[#f0f9ff]',
    placeholder: 'Beber agua tranquilamente',
    defaultDuration: 2
  },
  {
    id: ActiveBreakType.EYES,
    title: 'Mirar un Punto Fijo',
    subtitle: 'PAUSA ACTIVA',
    description: 'Relaja tu vista enfocando un objeto distante o estático para reducir la fatiga ocular.',
    icon: 'center_focus_strong',
    color: 'bg-[#6366f1]',
    bgColor: 'bg-[#f5f5f0]',
    placeholder: 'Descanso visual profundo',
    defaultDuration: 5
  },
  {
    id: ActiveBreakType.CUSTOM,
    title: 'Escribe tu actividad..',
    subtitle: 'PAUSA PERSONALIZADA',
    description: '',
    icon: 'more_horiz',
    color: 'bg-[#0f172a]',
    bgColor: 'bg-[#f8fafc]',
    placeholder: '',
    defaultDuration: 10
  }
];

export const RECENT_SESSIONS: SessionRecord[] = [
  { id: '1', type: BlockType.EJECUCION, category: 'Desarrollo', duration: 90, efficiency: 95, date: 'Hoy, 10:30 AM' },
  { id: '2', type: BlockType.MECANICA, category: 'Emails & Slack', duration: 30, efficiency: 80, date: 'Hoy, 09:45 AM' },
  { id: '3', type: BlockType.REGULAR, category: 'Diseño UI', duration: 60, efficiency: 88, date: 'Ayer, 03:15 PM' },
  { id: '4', type: BlockType.ESTRATEGIA, category: 'Personal', duration: 15, efficiency: 0, date: 'Ayer, 01:00 PM' },
];
