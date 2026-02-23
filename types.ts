
export enum View {
  DASHBOARD = 'DASHBOARD',
  SELECTION = 'SELECTION',
  TIMER = 'TIMER',
  BREAK_TIMER = 'BREAK_TIMER',
  SETTINGS = 'SETTINGS'
}

export enum BlockType {
  REGULAR = 'REGULAR',
  ESTRATEGIA = 'ESTRATEGIA',
  EJECUCION = 'EJECUCION',
  MECANICA = 'MECANICA'
}

export enum ActiveBreakType {
  WALK = 'WALK',
  WATER = 'WATER',
  EYES = 'EYES',
  CUSTOM = 'CUSTOM'
}

export interface EnergyBlock {
  id: BlockType;
  title: string;
  description: string;
  colorClass: string;
  icon: string;
  bgColor: string;
  textColor: string;
  defaultDuration: number;
}

export interface ActiveBreak {
  id: ActiveBreakType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  placeholder: string;
  defaultDuration: number;
}

export interface SessionRecord {
  id: string;
  type: BlockType;
  category: string;
  duration: number;
  efficiency: number;
  date: string;
}
