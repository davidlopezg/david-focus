
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onSignOut, isMobile, isMobileMenuOpen, toggleMobileMenu }) => {
  const menuItems = [
    { id: View.SELECTION, label: 'Bloques', icon: 'view_agenda' },
    { id: View.DASHBOARD, label: 'Estadísticas', icon: 'bar_chart' },
  ];

  if (isMobile) {
    return (
      <>
        {/* Mobile Header with Hamburger */}
        {!isMobileMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-40">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined fill-icon text-lg">dataset</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#0d121c] dark:text-white text-sm font-bold leading-tight">David-Focus</h1>
                <p className="text-[#49659c] dark:text-gray-400 text-xs font-normal">Productivity App</p>
              </div>
            </div>
            <button onClick={toggleMobileMenu} className="p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onSignOut()}>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#1a202c] border-r border-[#ced7e8] dark:border-gray-800 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col h-full">
                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-outlined fill-icon text-2xl">dataset</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[#0d121c] dark:text-white text-lg font-bold leading-tight">David-Focus</h1>
                    <p className="text-[#49659c] dark:text-gray-400 text-xs font-normal">Productivity App</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1 grow">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${currentView === item.id
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-[#49659c] dark:text-gray-400 hover:bg-[#f0f4fa] dark:hover:bg-gray-800'
                        }`}
                    >
                      <span className={`material-symbols-outlined text-[22px] transition-colors ${currentView === item.id ? 'fill-icon' : 'group-hover:text-primary'}`}>
                        {item.icon}
                      </span>
                      <p className={`text-sm leading-normal ${currentView === item.id ? 'font-bold' : 'font-medium group-hover:text-[#0d121c] dark:group-hover:text-white'}`}>
                        {item.label}
                      </p>
                    </button>
                  ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-[#ced7e8] dark:border-gray-800">
                  <button
                    onClick={() => onNavigate(View.SETTINGS)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${currentView === View.SETTINGS
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-[#49659c] dark:text-gray-400 hover:bg-[#f0f4fa] dark:hover:bg-gray-800'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] transition-colors ${currentView === View.SETTINGS ? 'fill-icon' : 'group-hover:text-primary'}`}>
                      settings
                    </span>
                    <p className={`text-sm leading-normal ${currentView === View.SETTINGS ? 'font-bold' : 'font-medium group-hover:text-[#0d121c] dark:group-hover:text-white'}`}>
                      Configuración
                    </p>
                  </button>

                  <button
                    onClick={onSignOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#49659c] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <p className="text-sm leading-normal font-medium">Cerrar sesión</p>
                  </button>

                  <div className="flex items-center gap-3 px-1 py-4 mt-2">
                    <img
                      src="https://picsum.photos/seed/david/80/80"
                      className="size-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
                      alt="Avatar"
                    />
                    <div className="flex flex-col text-left">
                      <p className="text-sm font-medium text-[#0d121c] dark:text-white">David M.</p>
                      <p className="text-xs text-[#49659c] dark:text-gray-400">Pro Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a202c] border-t border-[#ced7e8] dark:border-gray-800 z-40">
          <div className="flex items-center justify-evenly py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center px-4 py-1 rounded-lg transition-all ${currentView === item.id
                  ? 'text-primary'
                  : 'text-[#49659c] dark:text-gray-400 hover:text-[#0d121c] dark:hover:text-white'
                  }`}
              >
                <span className={`material-symbols-outlined text-2xl ${currentView === item.id ? 'fill-icon' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-xs mt-0.5">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => onNavigate(View.SETTINGS)}
              className={`flex flex-col items-center px-4 py-1 rounded-lg transition-all ${currentView === View.SETTINGS
                ? 'text-primary'
                : 'text-[#49659c] dark:text-gray-400 hover:text-[#0d121c] dark:hover:text-white'
                }`}
            >
              <span className={`material-symbols-outlined text-2xl ${currentView === View.SETTINGS ? 'fill-icon' : ''}`}>
                settings
              </span>
              <span className="text-xs mt-0.5">Config</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:flex w-64 flex-col border-r border-[#ced7e8] dark:border-gray-800 bg-white dark:bg-[#1a202c] transition-colors duration-200">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined fill-icon text-2xl">dataset</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#0d121c] dark:text-white text-lg font-bold leading-tight">David-Focus</h1>
            <p className="text-[#49659c] dark:text-gray-400 text-xs font-normal">Productivity App</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 grow">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${currentView === item.id
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-[#49659c] dark:text-gray-400 hover:bg-[#f0f4fa] dark:hover:bg-gray-800'
                }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-colors ${currentView === item.id ? 'fill-icon' : 'group-hover:text-primary'
                }`}>
                {item.icon}
              </span>
              <p className={`text-sm leading-normal ${currentView === item.id ? 'font-bold' : 'font-medium group-hover:text-[#0d121c] dark:group-hover:text-white'
                }`}>
                {item.label}
              </p>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#ced7e8] dark:border-gray-800">
          <button
            onClick={() => onNavigate(View.SETTINGS)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${currentView === View.SETTINGS
              ? 'bg-primary/10 text-primary dark:bg-primary/20'
              : 'text-[#49659c] dark:text-gray-400 hover:bg-[#f0f4fa] dark:hover:bg-gray-800'
              }`}
          >
            <span className={`material-symbols-outlined text-[22px] transition-colors ${currentView === View.SETTINGS ? 'fill-icon' : 'group-hover:text-primary'
              }`}>
              settings
            </span>
            <p className={`text-sm leading-normal ${currentView === View.SETTINGS ? 'font-bold' : 'font-medium group-hover:text-[#0d121c] dark:group-hover:text-white'
              }`}>
              Configuración
            </p>
          </button>

          <div className="flex items-center justify-between gap-2 px-1 py-3 mt-2">
            <div className="flex items-center gap-3">
              <img
                src="https://picsum.photos/seed/david/80/80"
                className="size-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
                alt="Avatar"
              />
              <div className="flex flex-col text-left">
                <p className="text-sm font-medium text-[#0d121c] dark:text-white">David M.</p>
                <p className="text-xs text-[#49659c] dark:text-gray-400">Pro Plan</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="p-2 text-[#49659c] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
