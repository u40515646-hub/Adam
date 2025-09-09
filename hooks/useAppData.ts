import { useState, useEffect, useCallback } from 'react';
import { User, Role, ScheduleEvent, TrainingPlan, Award, GrantedAward, ChatMessage } from '../types';
import { fetchData, saveData, isApiConfigured } from '../services/apiService';

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin Captain',
    pin: '1234',
    password: 'password123',
    role: Role.Captain,
    isActive: true,
    age: 35,
    avatar: '',
    stats: { attendance: 98, topSpeed: 2.1, endurance: 3000 },
    points: 1500,
  },
];

const predefinedAwards: Award[] = [
    { id: 1, title: 'Iron Will', description: 'For pushing through an exceptionally tough training set.', icon: 'bolt', points: 75 },
    { id: 2, title: 'Perfect Form', description: 'Demonstrated flawless technique during practice.', icon: 'star', points: 50 },
    { id: 3, title: 'Team Spirit', description: 'Showed great sportsmanship and motivated others.', icon: 'heart', points: 50 },
    { id: 4, title: 'Milestone Breaker', description: 'Achieved a new personal best or team record.', icon: 'trophy', points: 100 },
    { id: 5, title: 'Punctuality King/Queen', description: 'Perfect attendance and always on time.', icon: 'dashboard', points: 25 },
    { id: 6, title: 'The Strategist', description: 'For smart racing or excellent strategic thinking.', icon: 'team', points: 60 },
    { id: 7, title: 'Mentorship Award', description: 'Helped a teammate improve or learn a new skill.', icon: 'profile', points: 40 },
    { id: 8, title: 'Comeback Kid', description: 'Showed incredible resilience and recovery from a setback.', icon: 'leaderboard', points: 80 },
];

const getInitialState = () => ({
    users: initialUsers,
    schedule: [],
    trainingPlans: [],
    conversations: {},
    grantedAwards: [],
    currentUser: null,
    unreadCounts: {},
});

const useAppData = () => {
    const [appState, setAppState] = useState(getInitialState);
    const [isDataReady, setIsDataReady] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);

    // Fetch initial data from server on load
    useEffect(() => {
        const loadData = async () => {
            if (isApiConfigured()) {
                const data = await fetchData();
                if (data) {
                    // Create a new state object by merging initial state with fetched data.
                    // This prevents crashes if fetched data is incomplete (e.g., from a new npoint bin).
                    const initialState = getInitialState();
                    const mergedData = { ...initialState, ...data };

                    // Re-hydrate Date objects from the merged data
                    if (mergedData.conversations) {
                        Object.values(mergedData.conversations).forEach((convo: any) => {
                            convo.forEach((msg: ChatMessage) => { msg.timestamp = new Date(msg.timestamp); });
                        });
                    }
                    if (mergedData.grantedAwards) {
                        mergedData.grantedAwards.forEach((award: GrantedAward) => { award.timestamp = new Date(award.timestamp); });
                    }
                    
                    // If server has no users, fallback to initial users to ensure captain can log in
                    if (!mergedData.users || mergedData.users.length === 0) {
                        mergedData.users = initialUsers;
                    }

                    // Set the merged state, ensuring currentUser is always reset on a full data load
                    setAppState({ ...mergedData, currentUser: null });

                } else {
                    console.warn("API is configured, but failed to fetch data. Using local defaults.");
                    // Fallback to initial state if fetch fails
                    setAppState(getInitialState());
                }
            }
            setIsDataReady(true);
        };
        loadData();
    }, []);

    const syncWithServer = useCallback(async (state: any) => {
        if (isApiConfigured()) {
            // Exclude currentUser from being saved to the server
            const { currentUser, ...stateToSave } = state;
            await saveData(stateToSave);
        }
    }, []);

    const updateState = (updater: (prevState: typeof appState) => typeof appState) => {
        setAppState(prev => {
            const newState = updater(prev);
            syncWithServer(newState);
            return newState;
        });
    };

    const {
        users,
        schedule,
        trainingPlans,
        conversations,
        grantedAwards,
        currentUser,
        unreadCounts,
    } = appState;

    const login = (name: string, pinOrPassword: string, role: Role, captainPassword?: string): boolean => {
        const trimmedName = name.trim();
        const user = users.find(u => u.name.toLowerCase() === trimmedName.toLowerCase() && u.role === role);
        if (user && user.isActive) {
            if (role === Role.Captain && user.pin === pinOrPassword && user.password === captainPassword) {
                setAppState(prev => ({ ...prev, currentUser: user }));
                return true;
            }
            if (role === Role.Player && user.password === pinOrPassword) {
                setAppState(prev => ({ ...prev, currentUser: user }));
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setAppState(prev => ({ ...prev, currentUser: null }));
    };

    const activateSwimmer = (name: string, password: string): boolean => {
        const trimmedName = name.trim();
        const userIndex = users.findIndex(u => u.name.toLowerCase() === trimmedName.toLowerCase() && u.role === Role.Player && !u.isActive);
        if (userIndex !== -1) {
            updateState(prev => {
                const updatedUsers = [...prev.users];
                updatedUsers[userIndex] = { ...updatedUsers[userIndex], password, isActive: true };
                return { ...prev, users: updatedUsers };
            });
            return true;
        }
        return false;
    };
  
    const createCaptain = (name: string, pin: string, password: string): boolean => {
        const trimmedName = name.trim();
        if (users.some(u => u.name.toLowerCase() === trimmedName.toLowerCase())) {
            return false; // User already exists
        }
        const newCaptain: User = {
            id: Date.now(),
            name: trimmedName,
            pin,
            password,
            role: Role.Captain,
            isActive: true,
            age: 30, // Default age
            avatar: '',
            stats: { attendance: 0, topSpeed: 0, endurance: 0 },
            points: 0,
        };
        updateState(prev => ({ ...prev, users: [...prev.users, newCaptain] }));
        return true;
    };

    const addSwimmer = (name: string) => {
        const trimmedName = name.trim();
        if (users.some(u => u.name.toLowerCase() === trimmedName.toLowerCase())) return;
        const newSwimmer: User = {
            id: Date.now(),
            name: trimmedName,
            role: Role.Player,
            isActive: false,
            age: 18,
            avatar: '',
            stats: { attendance: 0, topSpeed: 0, endurance: 0 },
            points: 0,
        };
        updateState(prev => ({ ...prev, users: [...prev.users, newSwimmer] }));
    };

    const addScheduleEvent = (event: Omit<ScheduleEvent, 'id' | 'remindersSent'>) => {
        const newEvent: ScheduleEvent = {
            ...event,
            id: Date.now(),
            remindersSent: false,
        };
        updateState(prev => ({
            ...prev,
            schedule: [...prev.schedule, newEvent].sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time))
        }));
    };

    const addTrainingPlan = (plan: Omit<TrainingPlan, 'id'>) => {
        const newPlan: TrainingPlan = {
            ...plan,
            id: Date.now(),
        };
        updateState(prev => ({ ...prev, trainingPlans: [...prev.trainingPlans, newPlan] }));
    };
  
    const grantAward = (userId: number, awardId: number, reason: string): boolean => {
        if (appState.currentUser?.role !== Role.Captain) return false;
        const awardToGrant = predefinedAwards.find(a => a.id === awardId);
        if (!awardToGrant) return false;

        const newGrantedAward: GrantedAward = {
            id: Date.now(),
            award: awardToGrant,
            userId,
            reason,
            grantedByUserId: appState.currentUser.id,
            grantedByUserName: appState.currentUser.name,
            timestamp: new Date(),
        };
        updateState(prev => ({
            ...prev,
            grantedAwards: [...prev.grantedAwards, newGrantedAward],
            users: prev.users.map(u => u.id === userId ? { ...u, points: u.points + awardToGrant.points } : u)
        }));
        return true;
    };

    const sendDirectMessage = (senderId: number, receiverId: number, text: string) => {
        const sender = users.find(u => u.id === senderId);
        if (!sender) return;

        const conversationId = [senderId, receiverId].sort().join('-');
        const newMessage: ChatMessage = {
            id: Date.now(),
            userId: senderId,
            userName: sender.name,
            avatar: sender.avatar,
            text,
            timestamp: new Date(),
        };

        updateState(prev => {
            const updatedConversations = { ...prev.conversations };
            if (!updatedConversations[conversationId]) {
                updatedConversations[conversationId] = [];
            }
            updatedConversations[conversationId].push(newMessage);
            return {
                ...prev,
                conversations: updatedConversations,
                unreadCounts: {
                    ...prev.unreadCounts,
                    [receiverId]: (prev.unreadCounts[receiverId] || 0) + 1,
                }
            };
        });
    };

    const sendAlert = (message: string) => setAlert(message);
    const dismissAlert = () => setAlert(null);

    const deleteUser = (userId: number, pin: string): boolean => {
        if (appState.currentUser?.role !== Role.Captain || appState.currentUser.pin !== pin) {
            return false;
        }
        updateState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId) }));
        return true;
    };

    const deleteScheduleEvent = (eventId: number) => {
        if (appState.currentUser?.role !== Role.Captain) return;
        updateState(prev => ({ ...prev, schedule: prev.schedule.filter(e => e.id !== eventId) }));
    };

    const awardBonusPoints = (userId: number, points: number, pin: string): boolean => {
        if (appState.currentUser?.role !== Role.Captain || appState.currentUser.pin !== pin) {
            return false;
        }
        updateState(prev => ({
            ...prev,
            users: prev.users.map(u => (u.id === userId ? { ...u, points: u.points + points } : u))
        }));
        return true;
    };

    const updateUserAvatar = (userId: number, avatarDataUrl: string) => {
        updateState(prev => {
            const updatedUsers = prev.users.map(u => u.id === userId ? { ...u, avatar: avatarDataUrl } : u);
            const updatedCurrentUser = prev.currentUser?.id === userId
                ? { ...prev.currentUser, avatar: avatarDataUrl }
                : prev.currentUser;
            return { ...prev, users: updatedUsers, currentUser: updatedCurrentUser };
        });
    };

    const clearChatNotifications = (userId: number) => {
        updateState(prev => {
            const newCounts = { ...prev.unreadCounts };
            if (newCounts[userId]) {
                delete newCounts[userId];
            }
            return { ...prev, unreadCounts: newCounts };
        });
    };
    
    return {
        isDataReady,
        currentUser,
        users,
        schedule,
        trainingPlans,
        predefinedAwards,
        grantedAwards,
        conversations,
        alert,
        unreadCounts,
        login,
        logout,
        activateSwimmer,
        createCaptain,
        addSwimmer,
        addScheduleEvent,
        addTrainingPlan,
        grantAward,
        sendDirectMessage,
        sendAlert,
        dismissAlert,
        deleteUser,
        deleteScheduleEvent,
        awardBonusPoints,
        updateUserAvatar,
        clearChatNotifications,
    };
};

export default useAppData;