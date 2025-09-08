import { useState, useMemo } from 'react';
import { User, Role, ScheduleEvent, TrainingPlan, Challenge, ChatMessage } from '../types';
import { GoogleGenAI } from '@google/genai';

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
const initialChallenges: Challenge[] = [];

const useMockData = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(initialSchedule);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(initialTrainingPlans);
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(initialConversations);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const getAI = () => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  };

  const login = (name: string, pinOrPassword: string, role: Role, captainPassword?: string): boolean => {
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === role);
    if (user && user.isActive) {
      if (role === Role.Captain && user.pin === pinOrPassword && user.password === captainPassword) {
        setCurrentUser(user);
        return true;
      }
      if (role === Role.Player && user.password === pinOrPassword) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const activateSwimmer = (name: string, password: string): boolean => {
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase() && u.role === Role.Player && !u.isActive);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], password, isActive: true };
      setUsers(updatedUsers);
      return true;
    }
    return false;
  };
  
  const createCaptain = (name: string, pin: string, password: string): boolean => {
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        return false; // User already exists
    }
    const newCaptain: User = {
        id: Date.now(),
        name,
        pin,
        password,
        role: Role.Captain,
        isActive: true,
        age: 30, // Default age
        avatar: '',
        stats: { attendance: 0, topSpeed: 0, endurance: 0 },
        points: 0,
    };
    setUsers(prev => [...prev, newCaptain]);
    return true;
  };

  const addSwimmer = (name: string) => {
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) return;
    const newSwimmer: User = {
      id: Date.now(),
      name,
      role: Role.Player,
      isActive: false,
      age: 18,
      avatar: '',
      stats: { attendance: 0, topSpeed: 0, endurance: 0 },
      points: 0,
    };
    setUsers(prev => [...prev, newSwimmer]);
  };

  const addScheduleEvent = (event: Omit<ScheduleEvent, 'id' | 'remindersSent'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Date.now(),
      remindersSent: false,
    };
    setSchedule(prev => [...prev, newEvent].sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time)));
  };

  const addTrainingPlan = (plan: Omit<TrainingPlan, 'id'>) => {
    const newPlan: TrainingPlan = {
      ...plan,
      id: Date.now(),
    };
    setTrainingPlans(prev => [...prev, newPlan]);
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

    setConversations(prev => {
        const updatedConversations = { ...prev };
        if (!updatedConversations[conversationId]) {
            updatedConversations[conversationId] = [];
        }
        updatedConversations[conversationId].push(newMessage);
        return updatedConversations;
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
    setUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  const deleteScheduleEvent = (eventId: number) => {
    if (currentUser?.role !== Role.Captain) return;
    setSchedule(prev => prev.filter(e => e.id !== eventId));
  };

  const awardBonusPoints = (userId: number, points: number, pin: string): boolean => {
    if (currentUser?.role !== Role.Captain || currentUser.pin !== pin) {
      return false;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + points } : u));
    return true;
  };
  
  const updateUserAvatar = (userId: number, avatarDataUrl: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, avatar: avatarDataUrl } : user
      )
    );
  };

  return {
    currentUser,
    users,
    schedule,
    trainingPlans,
    challenges,
    conversations,
    alert,
    login,
    logout,
    activateSwimmer,
    createCaptain,
    addSwimmer,
    addScheduleEvent,
    addTrainingPlan,
    sendDirectMessage,
    sendAlert,
    dismissAlert,
    deleteUser,
    deleteScheduleEvent,
    awardBonusPoints,
    updateUserAvatar,
    getAI,
  };
};

export default useMockData;