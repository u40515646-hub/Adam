import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface AlertBannerProps {
  message: string;
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, onDismiss }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(message) {
            setShow(true);
        }
    }, [message])

    const handleDismiss = () => {
        setShow(false);
        // allow time for animation before removing from DOM
        setTimeout(onDismiss, 300);
    }

  return (
    <div className={`bg-gradient-to-r from-secondary to-primary text-white p-3 text-center flex justify-between items-center transition-transform duration-300 ease-in-out ${show ? 'translate-y-0' : '-translate-y-full'}`}>
        <span className="font-semibold">{message}</span>
        <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <Icon name="close" className="w-5 h-5" />
        </button>
    </div>
  );
};

export default AlertBanner;
