import React, { useState } from 'react';
import { useApp } from '../App';
import Sidebar from './Sidebar';
import ScheduleView from './views/ScheduleView';
import TrainingPlansView from './views/TrainingPlansView';
import TeamView from './views/TeamView';
import LeaderboardView from './views/LeaderboardView';
import ChatView from './views/ChatView';
import AIAnalysisView from './views/AIAnalysisView';
import ProfileView from './views/ProfileView';
import AlertBanner from './common/AlertBanner';
import AddScheduleView from './views/AddScheduleView';
import QuickAlertView from './views/QuickAlertView';

export type View = 'dashboard' | 'team' | 'schedule' | 'leaderboard' | 'chat' | 'ai' | 'profile' | 'training' | 'add-schedule' | 'send-alert';

const VIEW_TITLES: Record<View, string> = {
    dashboard: "Dashboard",
    team: "Team Roster",
    schedule: "Weekly Schedule",
    leaderboard: "Leaderboard",
    chat: "Direct Messages",
    ai: "AI Assistant",
    profile: "My Profile",
    training: "Training Plans",
    'add-schedule': "Add Schedule Event",
    'send-alert': "Send Quick Alert"
}

const Dashboard: React.FC = () => {
    const { currentUser, alert, dismissAlert } = useApp();
    const [activeView, setActiveView] = useState<View>('schedule');

    const renderView = () => {
        switch (activeView) {
            case 'schedule': return <ScheduleView />;
            case 'team': return <TeamView />;
            case 'leaderboard': return <LeaderboardView />;
            case 'chat': return <ChatView />;
            case 'ai': return <AIAnalysisView />;
            case 'profile': return <ProfileView />;
            case 'training': return <TrainingPlansView />;
            case 'add-schedule': return <AddScheduleView />;
            case 'send-alert': return <QuickAlertView />;
            default: return <ScheduleView />;
        }
    };

    if (!currentUser) return null;

    return (
        <div className="flex h-screen bg-base-100 text-white animate-fade-in">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                {alert && <AlertBanner message={alert} onDismiss={dismissAlert} />}
                <header className="bg-base-200/50 p-4 border-b border-white/10 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">{VIEW_TITLES[activeView]}</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div key={activeView} className="animate-fade-in-up">
                      {renderView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
