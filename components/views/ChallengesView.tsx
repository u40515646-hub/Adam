import React, { useState } from 'react';
import { useApp } from '../../App';
import { Challenge, Role } from '../../types';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import Notification from '../Notification';

const ChallengesView: React.FC = () => {
    const { challenges, currentUser, addChallenge, completeChallenge } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({ title: '', description: '', points: 50 });
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const handleAddChallenge = (e: React.FormEvent) => {
        e.preventDefault();
        if (newChallenge.title && newChallenge.description && newChallenge.points > 0) {
            addChallenge(newChallenge);
            setNotification({ message: `Challenge "${newChallenge.title}" added!`, type: 'success' });
            setNewChallenge({ title: '', description: '', points: 50 });
            setIsModalOpen(false);
        }
    };
    
    const handleCompleteChallenge = (challenge: Challenge) => {
        completeChallenge(challenge.id);
        setNotification({ message: `Challenge completed! You earned ${challenge.points} points.`, type: 'success' });
    }

    if (!currentUser) return null;
    
    return (
        <div>
            <Notification message={notification?.message || null} type={notification?.type || 'success'} onDismiss={() => setNotification(null)} />
            
            {currentUser.role === Role.Captain && (
                <div className="mb-6 text-right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                    >
                        <Icon name="plus" className="w-5 h-5 mr-2"/>
                        Add Challenge
                    </button>
                </div>
            )}

            {challenges.length === 0 ? (
                 <Card className="text-center animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-white mb-2">No Challenges Yet</h2>
                    <p className="text-gray-400">The captain hasn't added any challenges. Check back soon!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge, index) => {
                        const isCompleted = challenge.completedByUserIds.includes(currentUser.id);
                        return (
                            <Card 
                                key={challenge.id}
                                className="flex flex-col animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white mb-2 pr-4">{challenge.title}</h3>
                                    <div className="flex-shrink-0 bg-yellow-400/10 text-yellow-400 font-bold text-sm px-3 py-1 rounded-full flex items-center">
                                        <Icon name="trophy" className="w-4 h-4 mr-1.5" />
                                        {challenge.points}
                                    </div>
                                </div>
                                <p className="text-gray-400 flex-grow mb-6">{challenge.description}</p>
                                
                                {isCompleted ? (
                                    <div className="mt-auto w-full bg-success/20 text-success font-bold py-2 px-4 rounded-lg text-center">
                                        Completed
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleCompleteChallenge(challenge)}
                                        className="mt-auto w-full bg-secondary hover:bg-secondary-focus text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Challenge">
                <form onSubmit={handleAddChallenge} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            value={newChallenge.title}
                            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={newChallenge.description}
                            onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none h-24"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                        <input
                            type="number"
                            min="1"
                            value={newChallenge.points}
                            onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value, 10) || 1 })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">Add Challenge</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ChallengesView;
