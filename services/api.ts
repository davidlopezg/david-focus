
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BlockType, ActiveBreakType, SessionRecord } from '../types';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
}

const STORAGE_KEY = 'david_focus_supabase_config';

// Try to get from env first, then storage
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

class ApiService {
    private config: SupabaseConfig;
    private supabase: SupabaseClient;

    constructor() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.config = JSON.parse(stored);
            } catch (e) {
                this.config = { url: DEFAULT_URL, anonKey: DEFAULT_KEY };
            }
        } else {
            this.config = { url: DEFAULT_URL, anonKey: DEFAULT_KEY };
        }

        this.supabase = createClient(this.config.url, this.config.anonKey);
    }

    getConfig(): SupabaseConfig {
        return this.config;
    }

    setConfig(config: SupabaseConfig) {
        this.config = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        this.supabase = createClient(this.config.url, this.config.anonKey);
    }

    // AUTH METHODS
    async signUp(email: string, password: string) {
        return await this.supabase.auth.signUp({ email, password });
    }

    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    async signOut() {
        return await this.supabase.auth.signOut();
    }

    async getUser(): Promise<User | null> {
        const { data } = await this.supabase.auth.getUser();
        return data.user;
    }

    async getSession(): Promise<Session | null> {
        const { data } = await this.supabase.auth.getSession();
        return data.session;
    }

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange(callback);
    }

    // DATA METHODS
    async recordSession(session: {
        type: BlockType;
        title: string;
        duration: number;
        task: string;
        efficiency: number;
    }) {
        try {
            const user = await this.getUser();
            const { error } = await this.supabase
                .from('sessions')
                .insert([{
                    ...session,
                    user_id: user?.id,
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
        try {
            const user = await this.getUser();
            const { error } = await this.supabase
                .from('breaks')
                .insert([{
                    ...activeBreak,
                    user_id: user?.id,
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
        try {
            const { data: rawData, error } = await this.supabase
                .from('sessions')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (rawData && Array.isArray(rawData)) {
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

                const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
                const completedBlocks = sessions.length;

                const typeCounts: Record<string, number> = {};
                sessions.forEach(s => {
                    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
                });
                const topBlockType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

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
