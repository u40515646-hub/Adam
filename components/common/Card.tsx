import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;