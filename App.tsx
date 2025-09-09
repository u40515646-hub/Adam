import React, { createContext, useContext } from 'react';
import useMockData from './hooks/useMockData';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { User, Role, ScheduleEvent, TrainingPlan, Award, GrantedAward, ChatMessage } from './types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  schedule: ScheduleEvent[];
  trainingPlans: TrainingPlan[];
  predefinedAwards: Award[];
  grantedAwards: GrantedAward[];
  conversations: Record<string, ChatMessage[]>;
  alert: string | null;
  unreadCounts: Record<number, number>;
  login: (name: string, pinOrPassword: string, role: Role, captainPassword?: string) => boolean;
  logout: () => void;
  activateSwimmer: (name: string, password: string) => boolean;
  createCaptain: (name: string, pin: string, password: string) => boolean;
  addSwimmer: (name: string) => void;
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id' | 'remindersSent'>) => void;
  addTrainingPlan: (plan: Omit<TrainingPlan, 'id'>) => void;
  grantAward: (userId: number, awardId: number, reason: string) => boolean;
  sendDirectMessage: (senderId: number, receiverId: number, text: string) => void;
  sendAlert: (message: string) => void;
  dismissAlert: () => void;
  deleteUser: (userId: number, pin: string) => boolean;
  deleteScheduleEvent: (eventId: number) => void;
  awardBonusPoints: (userId: number, points: number, pin: string) => boolean;
  updateUserAvatar: (userId: number, avatarDataUrl: string) => void;
  clearChatNotifications: (userId: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockData = useMockData();
  return (
    <AppContext.Provider value={mockData}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const App: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="bg-base-100 min-h-screen text-white">
      {currentUser ? <Dashboard /> : <AuthScreen />}
    </div>
  );
};

export default App;