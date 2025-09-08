import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
