import React from 'react';
import { User } from '../../types';

interface AvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  if (!user) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const colors = [
    'bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 
    'bg-success', 'bg-warning', 'bg-error'
  ];
  const color = colors[user.id % colors.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-full h-full rounded-full object-cover`}
        />
      ) : (
        <div className={`w-full h-full rounded-full flex items-center justify-center ${color}`}>
            {getInitials(user.name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
