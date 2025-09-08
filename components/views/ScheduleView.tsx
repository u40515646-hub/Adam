import React from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Icon from '../common/Icon';
import { Role } from '../../types';

const ScheduleView: React.FC = () => {
    const { schedule, currentUser, deleteScheduleEvent } = useApp();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const today = new Date().getDay();

    const upcomingSchedule = daysOfWeek.map((_, index) => {
        const dayIndex = (today + index) % 7;
        return {
            dayName: daysOfWeek[dayIndex],
            dayIndex: dayIndex,
            events: schedule.filter(e => e.dayOfWeek === dayIndex),
        };
    }).filter(day => day.events.length > 0);


    const getEventTypeIcon = (type: 'Training' | 'Competition' | 'Meeting') => {
        switch (type) {
            case 'Training': return <Icon name="dashboard" className="w-5 h-5 text-accent" />;
            case 'Competition': return <Icon name="leaderboard" className="w-5 h-5 text-secondary" />;
            case 'Meeting': return <Icon name="team" className="w-5 h-5 text-primary" />;
        }
    }
    
    if (schedule.length === 0) {
        return (
            <Card className="text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-2">Schedule is Empty</h2>
                <p className="text-gray-400">The captain has not added any events to the schedule yet.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {upcomingSchedule.map((day, dayIndex) => (
                <Card 
                    key={day.dayIndex} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${dayIndex * 100}ms`}}
                >
                    <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-primary/50 pb-2">{day.dayName}</h2>
                    <ul className="space-y-4">
                        {day.events.map((event, eventIndex) => (
                             <li 
                                key={event.id}
                                className="flex items-center justify-between bg-base-200/50 p-4 rounded-lg animate-fade-in-up"
                                style={{ animationDelay: `${(dayIndex * 100) + (eventIndex * 50)}ms`}}
                            >
                                <div className="flex items-center space-x-4">
                                    {getEventTypeIcon(event.type)}
                                    <div>
                                        <p className="font-semibold text-white">{event.title}</p>
                                        <p className="text-sm text-gray-400">{event.time} - {event.type}</p>
                                    </div>
                                </div>
                                {currentUser?.role === Role.Captain && (
                                     <button 
                                        onClick={() => deleteScheduleEvent(event.id)}
                                        className="p-2 rounded-full text-gray-400 hover:bg-error/20 hover:text-error transition-colors"
                                    >
                                        <Icon name="close" className="w-5 h-5" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
    );
};

export default ScheduleView;
