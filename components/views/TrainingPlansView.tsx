import React, { useState } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { Role } from '../../types';
import Icon from '../common/Icon';

const TrainingPlansView: React.FC = () => {
    const { trainingPlans, addTrainingPlan, currentUser } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({ title: '', description: '', focus: '' });

    const handleAddPlan = (e: React.FormEvent) => {
        e.preventDefault();
        addTrainingPlan({
            ...newPlan,
            focus: newPlan.focus.split(',').map(f => f.trim())
        });
        setNewPlan({ title: '', description: '', focus: '' });
        setIsModalOpen(false);
    };

    if (trainingPlans.length === 0 && currentUser?.role !== Role.Captain) {
        return (
            <Card className="text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-2">No Training Plans Available</h2>
                <p className="text-gray-400">The captain has not added any training plans yet.</p>
            </Card>
        );
    }
    
    return (
        <div>
             {currentUser?.role === Role.Captain && (
                <div className="mb-6 text-right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                    >
                        <Icon name="plus" className="w-5 h-5 mr-2"/>
                        Add Training Plan
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingPlans.map((plan, index) => (
                    <Card 
                        key={plan.id}
                        className="flex flex-col animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {plan.focus.map(f => (
                                <span key={f} className="text-xs font-semibold bg-accent/20 text-accent px-2 py-1 rounded-full">{f}</span>
                            ))}
                        </div>
                        <p className="text-gray-400 flex-grow">{plan.description}</p>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Training Plan">
                <form onSubmit={handleAddPlan} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            value={newPlan.title}
                            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={newPlan.description}
                            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none h-24"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Focus Areas (comma separated)</label>
                        <input
                            type="text"
                            value={newPlan.focus}
                            onChange={(e) => setNewPlan({ ...newPlan, focus: e.target.value })}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="e.g., Sprint, Endurance, Starts"
                            required
                        />
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">Add Plan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TrainingPlansView;
