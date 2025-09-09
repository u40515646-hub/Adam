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
    { id: 'add-schedule', label: 'Add Schedule', icon: 'schedule', role: [Role.Captain] },
    { id: 'send-alert', label: 'Send Quick Alert', icon: 'settings', role: [Role.Captain] },
  ]

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


  const sidebarContent = (
    <div className="w-64 bg-base-200 flex-shrink-0 p-4 flex flex-col justify-between border-r border-white/10 h-full">
        <div>
            <div className="flex items-center space-x-2 p-3 mb-6">
            <h1 className="text-2xl font-bold text-white tracking-wider">Stormfins</h1>
            </div>

            <nav className="space-y-2">
                <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h2>
                <ul>
                    {navItems
                        .filter(item => item.role.includes(currentUser.role))
                        .map((item) => <NavLink key={item.id} {...item} id={item.id as View} />)}
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
                onClick={() => handleNavClick('profile')}
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
    </div>
  );

  return (
    <>
        {/* Mobile Sidebar */}
        <div className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
        <aside className={`fixed md:relative inset-y-0 left-0 z-40 transform md:transform-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          {sidebarContent}
        </aside>
    </>
  );
};

export default Sidebar;