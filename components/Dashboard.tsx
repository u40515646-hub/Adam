import React, { useState } from 'react';
import { useApp } from '../App';
import Sidebar from './Sidebar';
import ScheduleView from './views/ScheduleView';
import TrainingPlansView from './views/TrainingPlansView';
import TeamView from './views/TeamView';
import LeaderboardView from './views/LeaderboardView';
import ChatView from './views/ChatView';
import ProfileView from './views/ProfileView';
import AlertBanner from './common/AlertBanner';
import QuickAlertView from './views/QuickAlertView';
import ChallengesView from './views/ChallengesView';
import Icon from './common/Icon';
import AddScheduleView from './views/AddScheduleView';
import AddTrainingPlanView from './views/AddTrainingPlanView';
import GrantAwardView from './views/GrantAwardView';

export type View = 'dashboard' | 'team' | 'schedule' | 'leaderboard' | 'chat' | 'profile' | 'training' | 'awards' | 'send-alert' | 'add-schedule' | 'add-training-plan' | 'grant-award';

const VIEW_TITLES: Record<View, string> = {
    dashboard: "Dashboard",
    team: "Team Roster",
    schedule: "Weekly Schedule",
    leaderboard: "Leaderboard",
    chat: "Direct Messages",
    profile: "My Profile",
    training: "Training Plans",
    awards: "Team Awards",
    'send-alert': "Send Quick Alert",
    'add-schedule': "Add Schedule Event",
    'add-training-plan': "Add Training Plan",
    'grant-award': "Grant Award"
}

const Dashboard: React.FC = () => {
    const { currentUser, alert, dismissAlert } = useApp();
    const [activeView, setActiveView] = useState<View>('schedule');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderView = () => {
        switch (activeView) {
            case 'schedule': return <ScheduleView />;
            case 'team': return <TeamView />;
            case 'leaderboard': return <LeaderboardView />;
            case 'chat': return <ChatView />;
            case 'profile': return <ProfileView />;
            case 'training': return <TrainingPlansView />;
            case 'awards': return <ChallengesView />;
            case 'send-alert': return <QuickAlertView />;
            case 'add-schedule': return <AddScheduleView />;
            case 'add-training-plan': return <AddTrainingPlanView />;
            case 'grant-award': return <GrantAwardView />;
            default: return <ScheduleView />;
        }
    };

    if (!currentUser) return null;

    return (
        <div className="flex h-screen bg-base-100 text-white animate-fade-in">
            <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <main className="flex-1 flex flex-col overflow-hidden">
                {alert && <AlertBanner message={alert} onDismiss={dismissAlert} />}
                <header className="bg-base-200/50 p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                         <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-300 hover:text-white">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-white animate-fade-in-down">{VIEW_TITLES[activeView]}</h1>
                    </div>
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