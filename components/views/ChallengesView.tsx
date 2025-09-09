import React, { useState } from 'react';
import { useApp } from '../../App';
import { Role, User, Award } from '../../types';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import Notification from '../Notification';

const AwardIcon: React.FC<{icon: Award['icon'], className?: string}> = ({ icon, className = 'w-6 h-6' }) => {
    const iconColorMap: Record<Award['icon'], string> = {
        trophy: 'text-yellow-400',
        star: 'text-blue-400',
        bolt: 'text-purple-400',
        heart: 'text-pink-500',
        dashboard: 'text-teal-400',
        team: 'text-indigo-400',
        profile: 'text-green-400',
        leaderboard: 'text-orange-400',
    };
    return <Icon name={icon} className={`${className} ${iconColorMap[icon]}`} />;
};

const ChallengesView: React.FC = () => {
    const { currentUser, users, predefinedAwards, grantedAwards, grantAward } = useApp();
    const [isGrantModalOpen, setGrantModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [selectedSwimmerId, setSelectedSwimmerId] = useState<number | null>(null);
    const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);
    const [reason, setReason] = useState('');
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    if (!currentUser) return null;

    const swimmers = users.filter(u => u.role === Role.Player);

    const handleOpenModal = () => {
        setModalStep(1);
        setSelectedSwimmerId(swimmers.length > 0 ? swimmers[0].id : null);
        setSelectedAwardId(null);
        setReason('');
        setGrantModalOpen(true);
    };

    const handleProceed = () => {
        if (!selectedSwimmerId) {
             setNotification({ message: 'Please select a swimmer.', type: 'error' });
            return;
        }
         if (!selectedAwardId) {
             setNotification({ message: 'Please select an award.', type: 'error' });
            return;
        }
         if (!reason.trim()) {
            setNotification({ message: 'Please provide a reason for the award.', type: 'error' });
            return;
        }
        setModalStep(2);
    };

    const handleGrantAward = () => {
        if (selectedSwimmerId && selectedAwardId && reason) {
            const success = grantAward(selectedSwimmerId, selectedAwardId, reason);
            const award = predefinedAwards.find(a => a.id === selectedAwardId);
            const swimmer = users.find(u => u.id === selectedSwimmerId);
            if (success && award && swimmer) {
                setNotification({ message: `Awarded "${award.title}" to ${swimmer.name}.`, type: 'success'});
            } else {
                 setNotification({ message: 'Failed to grant award.', type: 'error'});
            }
        }
        setGrantModalOpen(false);
    };

    // Captain's View
    if (currentUser.role === Role.Captain) {
        const allGrantedAwards = [...grantedAwards].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
            <div className="relative min-h-[calc(100vh-200px)]">
                <Notification message={notification?.message || null} type={notification?.type || 'success'} onDismiss={() => setNotification(null)} />
                <h2 className="text-2xl font-bold mb-4 text-white">Team Awards Log</h2>
                
                {allGrantedAwards.length === 0 ? (
                    <Card className="text-center">
                        <p className="text-gray-400">No awards have been granted yet. Grant the first one!</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {allGrantedAwards.map((granted, index) => {
                            const swimmer = users.find(u => u.id === granted.userId);
                            return (
                                <Card key={granted.id} className="animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center mb-3 sm:mb-0">
                                            <div className="p-2 bg-base-300 rounded-full mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                                <AwardIcon icon={granted.award.icon} className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{granted.award.title}</h3>
                                                <p className="text-sm text-gray-300">Awarded to <span className="font-semibold text-primary">{swimmer?.name || 'Unknown'}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-left sm:text-right">
                                            <p>{new Date(granted.timestamp).toLocaleString()}</p>
                                            <p>By {granted.grantedByUserName}</p>
                                        </div>
                                    </div>
                                    {granted.reason && <p className="mt-3 pt-3 border-t border-white/10 text-gray-300 italic">"{granted.reason}"</p>}
                                </Card>
                            )
                        })}
                    </div>
                )}
                
                <button 
                    onClick={handleOpenModal}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20 animate-pulse-glow group"
                    aria-label="Grant New Award"
                >
                    <Icon name="plus" className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
                </button>

                <Modal isOpen={isGrantModalOpen} onClose={() => setGrantModalOpen(false)} title={modalStep === 1 ? 'Grant a New Award' : 'Confirm Award'}>
                    {modalStep === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">1. Reason for Award</label>
                                <textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" rows={3} placeholder="e.g., For exceptional effort in today's practice." />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">2. Select Award</label>
                                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-1">
                                    {predefinedAwards.map((award, index) => (
                                        <div 
                                            key={award.id} 
                                            onClick={() => setSelectedAwardId(award.id)} 
                                            className={`p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 animate-fade-in-up ${selectedAwardId === award.id ? 'border-primary bg-primary/20 scale-105 shadow-lg' : 'border-transparent bg-white/5 hover:bg-white/10 hover:border-primary/50'}`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <AwardIcon icon={award.icon} className="w-6 h-6 flex-shrink-0" />
                                                    <span className="font-semibold text-white">{award.title}</span>
                                                </div>
                                                <span className="text-sm font-bold text-primary">+{award.points}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 pl-9">{award.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">3. Select Swimmer</label>
                                <select value={selectedSwimmerId || ''} onChange={(e) => setSelectedSwimmerId(Number(e.target.value))} className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none">
                                    {swimmers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setGrantModalOpen(false)} className="bg-white/10 text-white font-bold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                                <button type="button" onClick={handleProceed} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">Next</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-white">
                           <p>You are about to grant the <span className="font-bold text-primary">{predefinedAwards.find(a=>a.id === selectedAwardId)?.title}</span> award to <span className="font-bold text-primary">{users.find(u=>u.id === selectedSwimmerId)?.name}</span>.</p>
                           <p className="italic bg-white/5 p-3 rounded-lg">"{reason}"</p>
                           <p>Are you sure you want to proceed?</p>
                           <div className="flex justify-end space-x-4 pt-4">
                                <button onClick={() => setModalStep(1)} className="font-bold py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20">Back</button>
                                <button onClick={handleGrantAward} className="font-bold py-2 px-4 rounded-lg bg-primary hover:bg-primary-focus">Confirm</button>
                           </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }

    // Swimmer's View
    const myAwards = grantedAwards.filter(ga => ga.userId === currentUser.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
         <div>
            {myAwards.length === 0 ? (
                <Card className="text-center animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-white mb-2">No Awards Yet</h2>
                    <p className="text-gray-400">You haven't received any awards. Keep up the hard work!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAwards.map((granted, index) => (
                        <Card
                            key={granted.id}
                            className="flex flex-col animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-base-300 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                     <AwardIcon icon={granted.award.icon} className="w-8 h-8" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white">{granted.award.title}</h3>
                                     <p className="font-bold text-primary">+{granted.award.points} points</p>
                                </div>
                            </div>
                             <p className="text-gray-400 flex-grow mb-4">{granted.award.description}</p>
                             {granted.reason && (
                                <div className="mb-4 pt-3 border-t border-white/10 italic">
                                   <p className="text-sm text-gray-300">"{granted.reason}"</p>
                                </div>
                             )}
                             <div className="text-xs text-gray-500 border-t border-white/10 pt-3 mt-auto">
                                 Granted by {granted.grantedByUserName} on {new Date(granted.timestamp).toLocaleDateString()}
                             </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChallengesView;