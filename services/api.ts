
import { BlockType, ActiveBreakType, EnergyBlock, SessionRecord } from '../types';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BlockType, ActiveBreakType, SessionRecord } from '../types';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
}

const STORAGE_KEY = 'david_focus_supabase_config';

class ApiService {
    private config: SupabaseConfig | null = null;
    private supabase: SupabaseClient | null = null;

    constructor() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.config = JSON.parse(stored);
                this.initSupabase();
            }
        } catch (e) {
            console.warn('Failed to access localStorage or init Supabase', e);
        }
    }

    private initSupabase() {
        if (this.config?.url && this.config?.anonKey) {
            this.supabase = createClient(this.config.url, this.config.anonKey);
        }
    }

    getConfig(): SupabaseConfig {
        return this.config || { url: '', anonKey: '' };
    }

    setConfig(config: SupabaseConfig) {
        this.config = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        this.initSupabase();
    }

    async recordSession(session: {
        type: BlockType;
        title: string;
        duration: number;
        task: string;
        efficiency: number;
    }) {
        if (!this.supabase) {
            console.warn('Supabase not configured');
            return false;
        }

        try {
            const { error } = await this.supabase
                .from('sessions')
                .insert([{
                    ...session,
                    timestamp: new Date().toISOString()
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error recording session to Supabase:', error);
            return false;
        }
    }

    async recordBreak(activeBreak: {
        type: ActiveBreakType;
        title: string;
        duration: number;
    }) {
        if (!this.supabase) {
            console.warn('Supabase not configured');
            return false;
        }

        try {
            const { error } = await this.supabase
                .from('breaks')
                .insert([{
                    ...activeBreak,
                    timestamp: new Date().toISOString()
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error recording break to Supabase:', error);
            return false;
        }
    }

    async fetchStats(): Promise<{
        sessions: SessionRecord[];
        summary: {
            totalTime: string;
            topBlock: string;
            completedBlocks: number;
            avgDuration: string;
        }
    } | null> {
        if (!this.supabase) {
            console.warn('Supabase not configured');
            return null;
        }

        try {
            const { data: rawData, error } = await this.supabase
                .from('sessions')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (rawData && Array.isArray(rawData)) {
                // 1. Map to SessionRecord
                const sessions: SessionRecord[] = rawData.map((item: any) => ({
                    id: String(item.id || Math.random()),
                    type: item.type as BlockType,
                    category: item.task || item.title || 'General',
                    duration: Number(item.duration) || 0,
                    efficiency: Number(item.efficiency) || 0,
                    date: item.timestamp ? new Date(item.timestamp).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    }) : 'Reciente'
                }));

                // 2. Calculate Summary
                const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
                const completedBlocks = sessions.length;

                // Top Block
                const typeCounts: Record<string, number> = {};
                sessions.forEach(s => {
                    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
                });
                const topBlockType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

                // Format Total Time
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

                // Format Avg Duration
                const avgMins = completedBlocks > 0 ? Math.round(totalMinutes / completedBlocks) : 0;

                return {
                    sessions,
                    summary: {
                        totalTime,
                        topBlock: topBlockType,
                        completedBlocks,
                        avgDuration: `${avgMins} min`
                    }
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching stats from Supabase:', error);
            return null;
        }
    }
}

export const api = new ApiService();
