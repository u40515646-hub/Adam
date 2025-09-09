export enum Role {
  Captain = 'Captain',
  Player = 'Player',
}

export interface User {
  id: number;
  name: string;
  pin?: string; // For captain login
  password?: string; // For login
  role: Role;
  isActive: boolean; // Swimmers are inactive until they set a password
  age: number;
  avatar: string;
  stats: {
    attendance: number; // percentage
    topSpeed: number; // m/s
    endurance: number; // meters
  };
  points: number;
}

export interface ScheduleEvent {
  id: number;
  title: string;
  type: 'Training' | 'Competition' | 'Meeting';
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  time: string; // HH:mm format
  remindersSent: boolean;
}

export interface TrainingPlan {
  id: number;
  title: string;
  description: string;
  focus: string[]; // e.g., 'Sprint', 'Endurance', 'Starts'
}

export interface ChatMessage {
    id: number;
    userId: number;
    userName: string;
    avatar: string;
    text: string;
    timestamp: Date;
}

export interface Award {
  id: number;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'bolt' | 'heart' | 'dashboard' | 'team' | 'profile' | 'leaderboard';
  points: number;
}

export interface GrantedAward {
    id: number;
    award: Award;
    userId: number;
    grantedByUserId: number;
    grantedByUserName: string;
    timestamp: Date;
    reason: string;
}