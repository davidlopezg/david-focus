
import React, { useState, useCallback, useEffect } from 'react';
import { View, BlockType, EnergyBlock, ActiveBreak, ActiveBreakType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BlockSelection from './components/BlockSelection';
import TimerOverlay from './components/TimerOverlay';
import BreakTimerOverlay from './components/BreakTimerOverlay';
import Settings from './components/Settings';
import Login from './components/Login';
import { ENERGY_BLOCKS, ACTIVE_BREAKS } from './constants';
import { api, SupabaseConfig } from './services/api';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [blocks, setBlocks] = useState<EnergyBlock[]>(ENERGY_BLOCKS);
  const [activeBreaks, setActiveBreaks] = useState<ActiveBreak[]>(ACTIVE_BREAKS);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => api.getConfig());
  const [activeBlock, setActiveBlock] = useState<EnergyBlock | null>(null);
  const [activeBreak, setActiveBreak] = useState<ActiveBreak | null>(null);

  useEffect(() => {
    // Check initial session
    api.getSession().then((session) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = api.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    api.setConfig(supabaseConfig);
  }, [supabaseConfig]);

  const handleSelectBlock = useCallback((blockId: BlockType) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setActiveBlock(block);
      setCurrentView(View.TIMER);
    }
  }, [blocks]);

  const handleUpdateBlock = useCallback((updatedBlock: EnergyBlock) => {
    setBlocks(prev => prev.map(b => b.id === updatedBlock.id ? updatedBlock : b));
  }, []);

  const handleUpdateBreak = useCallback((updatedBreak: ActiveBreak) => {
    setActiveBreaks(prev => prev.map(b => b.id === updatedBreak.id ? updatedBreak : b));
  }, []);

  const handleSelectBreak = useCallback((breakId: ActiveBreakType) => {
    const breakData = activeBreaks.find(b => b.id === breakId);
    if (breakData) {
      setActiveBreak(breakData);
      setCurrentView(View.BREAK_TIMER);
    }
  }, [activeBreaks]);

  const handleCloseSession = useCallback(() => {
    setCurrentView(View.SELECTION);
    setActiveBlock(null);
    setActiveBreak(null);
  }, []);

  const handleSignOut = async () => {
    await api.signOut();
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.SELECTION:
        return (
          <BlockSelection
            blocks={blocks}
            activeBreaks={activeBreaks}
            onSelect={handleSelectBlock}
            onSelectBreak={handleSelectBreak}
          />
        );
      case View.SETTINGS:
        return (
          <Settings
            blocks={blocks}
            onUpdateBlock={handleUpdateBlock}
            activeBreaks={activeBreaks}
            onUpdateBreak={handleUpdateBreak}
            supabaseConfig={supabaseConfig}
            onUpdateSupabaseConfig={setSupabaseConfig}
          />
        );
      case View.TIMER:
        return activeBlock ? (
          <TimerOverlay
            block={activeBlock}
            onClose={handleCloseSession}
          />
        ) : null;
      case View.BREAK_TIMER:
        return activeBreak ? (
          <BreakTimerOverlay
            activeBreak={activeBreak}
            onClose={handleCloseSession}
          />
        ) : null;
      default:
        return <Dashboard />;
    }
  };

  const isFullScreenView = currentView === View.TIMER || currentView === View.BREAK_TIMER;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {!isFullScreenView && (
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onSignOut={handleSignOut}
        />
      )}

      <main className={`flex-1 overflow-hidden relative ${isFullScreenView ? 'w-full' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
