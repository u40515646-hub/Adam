import React from 'react';
import { useApp } from '../App';
import { View } from './Dashboard';
import Icon from './common/Icon';
import Avatar from './common/Avatar';
import { Role } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  const { currentUser, logout, unreadCounts } = useApp();

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setIsOpen(false);
  }

  if (!currentUser) return null;

  const unreadCount = unreadCounts[currentUser.id] || 0;

  const navItems = [
    { id: 'schedule', label: 'Schedule', icon: 'schedule', role: [Role.Captain, Role.Player] },
    { id: 'team', label: 'Team', icon: 'team', role: [Role.Captain, Role.Player] },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard', role: [Role.Captain, Role.Player] },
    { id: 'awards', label: 'Awards', icon: 'trophy', role: [Role.Captain, Role.Player] },
    { id: 'training', label: 'Training Plans', icon: 'dashboard', role: [Role.Captain] },
    { id: 'chat', label: 'Chat', icon: 'chat', role: [Role.Captain, Role.Player], badge: unreadCount },
  ];
  
  const captainTools = [
    { id: 'send-alert', label: 'Send Quick Alert', icon: 'send', role: [Role.Captain] },
    { id: 'settings', label: 'Server Settings', icon: 'settings', role: [Role.Captain] },
  ];

  const NavLink: React.FC<{ id: View; label: string; icon: string; badge?: number }> = ({ id, label, icon, badge }) => (
    <li
      onClick={() => handleNavClick(id)}
      className={`flex items-center justify-between space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 relative group ${
        activeView === id ? 'bg-primary/20 text-white shadow-inner shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
      }`}
    >
      <div className="flex items-center space-x-3">
        {activeView === id && <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full animate-pop-in"></div>}
        <Icon name={icon} className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        <span>{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="bg-secondary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pop-in">
            {badge}
        </span>
      )}
    </li>
  );

  return (
    <>
        <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
        <aside className={`fixed top-0 left-0 h-full w-64 bg-base-200/95 backdrop-blur-lg border-r border-white/10 flex flex-col z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <Icon name="dashboard" className="w-8 h-8 gradient-text" />
                    <h1 className="text-xl font-bold text-white">Stormfins</h1>
                </div>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-4 flex items-center space-x-3 border-b border-white/10 cursor-pointer hover:bg-white/5" onClick={() => handleNavClick('profile')}>
                <Avatar user={currentUser} size="md" />
                <div>
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.role}</p>
                </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Menu</p>
                    <ul>
                        {navItems.filter(item => item.role.includes(currentUser.role)).map(item => (
                            <NavLink key={item.id} id={item.id as View} label={item.label} icon={item.icon} badge={item.badge} />
                        ))}
                    </ul>
                </div>
                {currentUser.role === Role.Captain && (
                    <div>
                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Captain Tools</p>
                         <ul>
                             {captainTools.map(item => (
                                 <NavLink key={item.id} id={item.id as View} label={item.label} icon={item.icon} />
                             ))}
                         </ul>
                    </div>
                )}
            </nav>
            
            <div className="p-4 border-t border-white/10">
                <button onClick={logout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-error/20 hover:text-error transition-colors duration-200">
                    <Icon name="logout" className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    </>
  );
};

export default Sidebar;