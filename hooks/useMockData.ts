import { useState, useEffect } from 'react';
import { User, Role, ScheduleEvent, TrainingPlan, Award, GrantedAward, ChatMessage } from '../types';

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

const initialSchedule: ScheduleEvent[] = [];
const initialTrainingPlans: TrainingPlan[] = [];
const initialConversations: Record<string, ChatMessage[]> = {};

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

const STORAGE_KEY = 'stormfinsAppState';

const getInitialState = () => {
    try {
        const storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Re-hydrate Date objects from JSON strings
            if (parsedState.conversations) {
                Object.values(parsedState.conversations).forEach((convo: any) => {
                    convo.forEach((msg: ChatMessage) => {
                        msg.timestamp = new Date(msg.timestamp);
                    });
                });
            }
            if (parsedState.grantedAwards) {
                parsedState.grantedAwards.forEach((award: GrantedAward) => {
                    award.timestamp = new Date(award.timestamp);
                });
            }
            return parsedState;
        }
    } catch (error) {
        console.error("Failed to parse state from localStorage", error);
    }
    // Return initial state if nothing in localStorage or if parsing fails
    return {
        users: initialUsers,
        schedule: initialSchedule,
        trainingPlans: initialTrainingPlans,
        conversations: initialConversations,
        grantedAwards: [],
        currentUser: null,
        unreadCounts: {},
    };
};


const useMockData = () => {
    const [appState, setAppState] = useState(getInitialState);
    const [alert, setAlert] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [appState]);

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
            setAppState(prev => {
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
        setAppState(prev => ({ ...prev, users: [...prev.users, newCaptain] }));
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
        setAppState(prev => ({ ...prev, users: [...prev.users, newSwimmer] }));
    };

    const addScheduleEvent = (event: Omit<ScheduleEvent, 'id' | 'remindersSent'>) => {
        const newEvent: ScheduleEvent = {
            ...event,
            id: Date.now(),
            remindersSent: false,
        };
        setAppState(prev => ({
            ...prev,
            schedule: [...prev.schedule, newEvent].sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time))
        }));
    };

    const addTrainingPlan = (plan: Omit<TrainingPlan, 'id'>) => {
        const newPlan: TrainingPlan = {
            ...plan,
            id: Date.now(),
        };
        setAppState(prev => ({ ...prev, trainingPlans: [...prev.trainingPlans, newPlan] }));
    };
  
    const grantAward = (userId: number, awardId: number, reason: string): boolean => {
        if (currentUser?.role !== Role.Captain) return false;
        const awardToGrant = predefinedAwards.find(a => a.id === awardId);
        if (!awardToGrant) return false;

        const newGrantedAward: GrantedAward = {
            id: Date.now(),
            award: awardToGrant,
            userId,
            reason,
            grantedByUserId: currentUser.id,
            grantedByUserName: currentUser.name,
            timestamp: new Date(),
        };
        setAppState(prev => ({
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

        setAppState(prev => {
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

    const sendAlert = (message: string) => {
        setAlert(message);
    };
    const dismissAlert = () => {
        setAlert(null);
    };

    const deleteUser = (userId: number, pin: string): boolean => {
        if (currentUser?.role !== Role.Captain || currentUser.pin !== pin) {
            return false;
        }
        setAppState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId) }));
        return true;
    };

    const deleteScheduleEvent = (eventId: number) => {
        if (currentUser?.role !== Role.Captain) return;
        setAppState(prev => ({ ...prev, schedule: prev.schedule.filter(e => e.id !== eventId) }));
    };

    const awardBonusPoints = (userId: number, points: number, pin: string): boolean => {
        if (currentUser?.role !== Role.Captain || currentUser.pin !== pin) {
            return false;
        }
        setAppState(prev => ({
            ...prev,
            users: prev.users.map(u => (u.id === userId ? { ...u, points: u.points + points } : u))
        }));
        return true;
    };

    const updateUserAvatar = (userId: number, avatarDataUrl: string) => {
        setAppState(prev => {
            const updatedUsers = prev.users.map(u => u.id === userId ? { ...u, avatar: avatarDataUrl } : u);
            const updatedCurrentUser = prev.currentUser?.id === userId
                ? { ...prev.currentUser, avatar: avatarDataUrl }
                : prev.currentUser;
            return { ...prev, users: updatedUsers, currentUser: updatedCurrentUser };
        });
    };

    const clearChatNotifications = (userId: number) => {
        setAppState(prev => {
            const newCounts = { ...prev.unreadCounts };
            if (newCounts[userId]) {
                delete newCounts[userId];
            }
            return { ...prev, unreadCounts: newCounts };
        });
    };

    return {
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

export default useMockData;