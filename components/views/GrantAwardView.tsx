import React, { useState } from 'react';
import { useApp } from '../../App';
import { Role, Award } from '../../types';
import Card from '../common/Card';
import Icon from '../common/Icon';
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

const GrantAwardView: React.FC = () => {
    const { users, predefinedAwards, grantAward } = useApp();
    const [step, setStep] = useState(1);
    const [selectedSwimmerId, setSelectedSwimmerId] = useState<number | null>(null);
    const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);
    const [reason, setReason] = useState('');
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    
    const swimmers = users.filter(u => u.role === Role.Player);

    // Initialize selected swimmer if not set and swimmers exist
    if (swimmers.length > 0 && selectedSwimmerId === null) {
        setSelectedSwimmerId(swimmers[0].id);
    }

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
        setStep(2);
    };
    
    const handleGrantAward = () => {
        if (selectedSwimmerId && selectedAwardId && reason) {
            const success = grantAward(selectedSwimmerId, selectedAwardId, reason);
            const award = predefinedAwards.find(a => a.id === selectedAwardId);
            const swimmer = users.find(u => u.id === selectedSwimmerId);
            if (success && award && swimmer) {
                setNotification({ message: `Awarded "${award.title}" to ${swimmer.name}.`, type: 'success'});
                // Reset form
                setStep(1);
                setSelectedSwimmerId(swimmers.length > 0 ? swimmers[0].id : null);
                setSelectedAwardId(null);
                setReason('');
            } else {
                 setNotification({ message: 'Failed to grant award.', type: 'error'});
            }
        }
    };
    
    return (
        <Card className="max-w-2xl mx-auto">
             <Notification message={notification?.message || null} type={notification?.type || 'success'} onDismiss={() => setNotification(null)} />
             <h2 className="text-2xl font-bold text-white mb-6">{step === 1 ? 'Grant a New Award' : 'Confirm Award'}</h2>
             
             {step === 1 ? (
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
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={handleProceed} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">Next</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 text-white">
                   <p>You are about to grant the <span className="font-bold text-primary">{predefinedAwards.find(a=>a.id === selectedAwardId)?.title}</span> award to <span className="font-bold text-primary">{users.find(u=>u.id === selectedSwimmerId)?.name}</span>.</p>
                   <p className="italic bg-white/5 p-3 rounded-lg">"{reason}"</p>
                   <p>Are you sure you want to proceed?</p>
                   <div className="flex justify-end space-x-4 pt-4">
                        <button onClick={() => setStep(1)} className="font-bold py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20">Back</button>
                        <button onClick={handleGrantAward} className="font-bold py-3 px-6 rounded-lg bg-primary hover:bg-primary-focus">Confirm & Grant</button>
                   </div>
                </div>
            )}
        </Card>
    );
};

export default GrantAwardView;
