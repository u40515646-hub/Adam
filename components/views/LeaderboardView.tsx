import React, { useState } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { Role } from '../../types';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import Notification from '../Notification';

interface NotificationState {
    message: string | null;
    type: 'success' | 'error';
}

const LeaderboardView: React.FC = () => {
    const { users, currentUser, awardBonusPoints } = useApp();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [points, setPoints] = useState(0);
    const [pin, setPin] = useState('');
    const [notification, setNotification] = useState<NotificationState>({ message: null, type: 'success' });


    const sortedSwimmers = users
        .filter(u => u.role === Role.Player)
        .sort((a, b) => b.points - a.points);
    
    const openAwardModal = (userId: number) => {
        setSelectedUserId(userId);
        setModalOpen(true);
    };

    const handleAwardPoints = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserId && points > 0) {
            const success = awardBonusPoints(selectedUserId, points, pin);
            if (success) {
                const user = users.find(u => u.id === selectedUserId);
                setNotification({ message: `Awarded ${points} points to ${user?.name}.`, type: 'success' });
            } else {
                setNotification({ message: 'Incorrect PIN. Failed to award points.', type: 'error' });
            }
        }
        setModalOpen(false);
        setSelectedUserId(null);
        setPoints(0);
        setPin('');
    };

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'border-yellow-400/50 bg-yellow-400/10';
        if (rank === 1) return 'border-slate-400/50 bg-slate-400/10';
        if (rank === 2) return 'border-orange-400/50 bg-orange-400/10';
        return 'border-transparent';
    }

    const getRankIcon = (rank: number) => {
        if (rank === 0) return '🥇';
        if (rank === 1) return '🥈';
        if (rank === 2) return '🥉';
        return rank + 1;
    }
    
    return (
        <Card>
            <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: null, type: 'success' })} />
            <h2 className="text-2xl font-bold mb-6 text-white">Swimmer Rankings</h2>
            <ul className="space-y-3">
                {sortedSwimmers.map((swimmer, index) => (
                    <li 
                        key={swimmer.id}
                        className={`flex items-center p-3 rounded-lg border-2 ${getRankColor(index)} animate-fade-in-up`}
                        style={{ animationDelay: `${index * 75}ms` }}
                    >
                        <div className="flex-shrink-0 w-8 text-center">
                            <span className="font-bold text-lg">{getRankIcon(index)}</span>
                        </div>
                        <div className="flex-grow flex items-center space-x-3 ml-3">
                            <Avatar user={swimmer} size="md" />
                            <span className="font-semibold text-white truncate">{swimmer.name}</span>
                        </div>
                        <div className="flex-shrink-0 text-right w-24">
                           <span className="font-bold text-lg text-primary">{swimmer.points.toLocaleString()} pts</span>
                        </div>
                         {currentUser?.role === Role.Captain && (
                            <div className="flex-shrink-0 w-12 text-right">
                               <button 
                                   onClick={() => openAwardModal(swimmer.id)}
                                   className="p-2 rounded-full text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors"
                                >
                                    <Icon name="plus" className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Award Bonus Points">
                <form onSubmit={handleAwardPoints} className="space-y-4">
                     <p className="text-gray-300">
                       Award bonus points to {users.find(u=>u.id === selectedUserId)?.name}.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                            min="1"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Captain PIN</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div className="pt-4 flex space-x-4">
                         <button type="button" onClick={() => setModalOpen(false)} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                         <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus transition-opacity">Award Points</button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
};

export default LeaderboardView;