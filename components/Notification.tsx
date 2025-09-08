import React, { useEffect, useState } from 'react';
import Icon from './common/Icon';

type NotificationProps = {
  message: string | null;
  type: 'success' | 'error';
  onDismiss: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        // Allow time for fade-out animation before calling onDismiss
        setTimeout(onDismiss, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-success/80 backdrop-blur-md' : 'bg-error/80 backdrop-blur-md';
  const borderColor = type === 'success' ? 'border-success' : 'border-error';

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg border ${borderColor} ${bgColor} text-white transition-all duration-300 ease-in-out transform ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="mr-3">
        {type === 'success' ? <Icon name="dashboard" className="w-6 h-6" /> : <Icon name="close" className="w-6 h-6" />}
      </div>
      <div>{message}</div>
      <button onClick={() => setShow(false)} className="ml-4 p-1 rounded-full hover:bg-white/20">
         <Icon name="close" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
