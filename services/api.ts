
import { BlockType, ActiveBreakType, EnergyBlock, SessionRecord } from '../types';

export interface N8nConfig {
    sessionsWebhook: string;
    breaksWebhook: string;
    statsWebhook: string;
}

const STORAGE_KEY = 'david_focus_n8n_config';

const DEFAULT_CONFIG: N8nConfig = {
    sessionsWebhook: 'https://n8n.srv792299.hstgr.cloud/webhook/webhook/record',
    breaksWebhook: 'https://n8n.srv792299.hstgr.cloud/webhook/webhook/record',
    statsWebhook: 'https://n8n.srv792299.hstgr.cloud/webhook/webhook/stats'
};

class ApiService {
    private config: N8nConfig;

    constructor() {
        try {
            // Try to load from localStorage
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    this.config = JSON.parse(stored);
                } catch (e) {
                    console.warn('Failed to parse stored config, using defaults');
                    this.config = DEFAULT_CONFIG;
                }
            } else {
                this.config = DEFAULT_CONFIG;
            }
        } catch (e) {
            console.warn('Failed to access localStorage, using defaults', e);
            this.config = DEFAULT_CONFIG;
        }
    }

    getConfig(): N8nConfig {
        return this.config;
    }

    setConfig(config: N8nConfig) {
        this.config = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    async recordSession(session: {
        type: BlockType;
        title: string;
        duration: number;
        task: string;
        efficiency: number;
    }) {
        if (!this.config.sessionsWebhook) {
            console.warn('n8n Sessions Webhook not configured');
            return;
        }

        try {
            const response = await fetch(this.config.sessionsWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...session,
                    timestamp: new Date().toISOString()
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Error recording session to n8n:', error);
            return false;
        }
    }

    async recordBreak(activeBreak: {
        type: ActiveBreakType;
        title: string;
        duration: number;
    }) {
        if (!this.config.breaksWebhook) {
            console.warn('n8n Breaks Webhook not configured');
            return;
        }

        try {
            const response = await fetch(this.config.breaksWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...activeBreak,
                    timestamp: new Date().toISOString()
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Error recording break to n8n:', error);
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
        if (!this.config.statsWebhook) {
            console.warn('n8n Stats Webhook not configured');
            return null;
        }

        try {
            const response = await fetch(this.config.statsWebhook, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const rawData = await response.json();

                // If we receive an array (raw sessions list), transform it
                if (Array.isArray(rawData)) {
                    // Sort by timestamp descending (newest first)
                    rawData.sort((a: any, b: any) => {
                        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                        return dateB - dateA;
                    });

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

                    // Format Total Time (e.g., "3h 45m" or "45 min")
                    const hours = Math.floor(totalMinutes / 60);
                    const mins = totalMinutes % 60;
                    const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

                    // Format Avg Duration
                    const avgMins = completedBlocks > 0 ? Math.round(totalMinutes / completedBlocks) : 0;

                    return {
                        sessions: sessions.slice(0, 50), // Limit to last 50 for performance
                        summary: {
                            totalTime,
                            topBlock: topBlockType,
                            completedBlocks,
                            avgDuration: `${avgMins} min`
                        }
                    };
                }

                // Fallback if it matches the expected structure already
                return rawData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching stats from n8n:', error);
            return null;
        }
    }
}

export const api = new ApiService();
