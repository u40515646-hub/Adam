import React, { useState } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Notification from '../Notification';

const AddTrainingPlanView: React.FC = () => {
    const { addTrainingPlan } = useApp();
    const [newPlan, setNewPlan] = useState({ title: '', description: '', focus: '' });
    const [notification, setNotification] = useState<string | null>(null);

    const handleAddPlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlan.title.trim() || !newPlan.description.trim() || !newPlan.focus.trim()) return;
        
        addTrainingPlan({
            ...newPlan,
            focus: newPlan.focus.split(',').map(f => f.trim())
        });
        setNotification(`Training plan "${newPlan.title}" added successfully!`);
        setNewPlan({ title: '', description: '', focus: '' });
    };
    
    return (
        <Card className="max-w-2xl mx-auto">
            <Notification message={notification} type="success" onDismiss={() => setNotification(null)} />
            <h2 className="text-2xl font-bold text-white mb-6">Add New Training Plan</h2>
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
        </Card>
    );
};

export default AddTrainingPlanView;
