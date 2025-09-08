import React, { useState } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import { ScheduleEvent } from '../../types';
import Notification from '../Notification';

const AddScheduleView: React.FC = () => {
    const { addScheduleEvent } = useApp();
    const [event, setEvent] = useState({
        title: '',
        type: 'Training' as ScheduleEvent['type'],
        dayOfWeek: 1, // Monday
        time: '08:00',
    });
    const [notification, setNotification] = useState<string | null>(null);
    
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addScheduleEvent(event);
        setNotification(`Event "${event.title}" added successfully!`);
        // Reset form
        setEvent({
            title: '',
            type: 'Training',
            dayOfWeek: 1,
            time: '08:00',
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <Notification message={notification} type="success" onDismiss={() => setNotification(null)} />
            <h2 className="text-2xl font-bold text-white mb-6">Add New Schedule Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                    <input
                        type="text"
                        value={event.title}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                        className="w-full bg-base-200 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                    <select
                        value={event.type}
                        onChange={(e) => setEvent({ ...event, type: e.target.value as ScheduleEvent['type'] })}
                         className="w-full bg-base-200 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option>Training</option>
                        <option>Competition</option>
                        <option>Meeting</option>
                    </select>
                </div>
                
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Day of the Week</label>
                         <select
                            value={event.dayOfWeek}
                            onChange={(e) => setEvent({ ...event, dayOfWeek: parseInt(e.target.value, 10) })}
                             className="w-full bg-base-200 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                           {daysOfWeek.map((day, index) => (
                               <option key={index} value={index}>{day}</option>
                           ))}
                        </select>
                    </div>
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                        <input
                            type="time"
                            value={event.time}
                            onChange={(e) => setEvent({ ...event, time: e.target.value })}
                             className="w-full bg-base-200 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">
                        Add Event
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddScheduleView;
