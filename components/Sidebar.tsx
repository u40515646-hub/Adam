import React from 'react';
import { useApp } from '../App';
import { View } from './Dashboard';
import Icon from './common/Icon';
import Avatar from './common/Avatar';
import { Role } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { currentUser, logout } = useApp();

  const navItems = [
    { id: 'schedule', label: 'Schedule', icon: 'schedule' },
    { id: 'team', label: 'Team', icon: 'team' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'training', label: 'Training Plans', icon: 'dashboard' },
    { id: 'chat', label: 'Chat', icon: 'chat' },
    { id: 'ai', label: 'AI Assistant', icon: 'ai' },
  ];
  
  const captainTools = [
    { id: 'add-schedule', label: 'Add Schedule Event', icon: 'plus' },
    { id: 'send-alert', label: 'Send Quick Alert', icon: 'settings' },
  ]

  const NavLink: React.FC<{ id: View; label: string; icon: string }> = ({ id, label, icon }) => (
    <li
      onClick={() => setActiveView(id)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 relative ${
        activeView === id ? 'bg-primary/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {activeView === id && <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full animate-pop-in"></div>}
      <Icon name={icon} className="w-5 h-5" />
      <span>{label}</span>
    </li>
  );

  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-base-200 flex-shrink-0 p-4 flex flex-col justify-between border-r border-white/10 animate-fade-in">
      <div>
        <div className="flex items-center space-x-2 p-3 mb-6">
          <h1 className="text-2xl font-bold text-white tracking-wider">Swimsfans</h1>
        </div>

        <nav className="space-y-2">
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h2>
            <ul>
                {navItems.map((item) => <NavLink key={item.id} {...item} id={item.id as View} />)}
            </ul>
            
            {currentUser.role === Role.Captain && (
                 <div className="pt-4">
                    <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Captain Tools</h2>
                     <ul className="space-y-2 mt-2">
                        {captainTools.map((item) => <NavLink key={item.id} {...item} id={item.id as View} />)}
                    </ul>
                 </div>
            )}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div 
           className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-white/5"
           onClick={() => setActiveView('profile')}
        >
          <Avatar user={currentUser} size="md" />
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{currentUser.name}</p>
            <p className="text-xs text-gray-400">{currentUser.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 mt-2 rounded-lg text-gray-400 hover:bg-error/20 hover:text-error transition-colors duration-300"
        >
          <Icon name="logout" className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
