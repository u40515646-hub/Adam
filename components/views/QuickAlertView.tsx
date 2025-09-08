import React, { useState } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Notification from '../Notification';

const QuickAlertView: React.FC = () => {
    const { sendAlert } = useApp();
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendAlert(message);
        setNotification('Alert has been sent to the entire team!');
        setMessage('');
    };

    return (
        <Card className="max-w-2xl mx-auto">
             <Notification message={notification} type="success" onDismiss={() => setNotification(null)} />
            <h2 className="text-2xl font-bold text-white mb-6">Send a Quick Alert</h2>
            <p className="text-gray-400 mb-6">
                This message will appear as a banner at the top of the screen for all active users. Use it for urgent announcements.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alert Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-base-200 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none h-24"
                        placeholder="e.g., Practice cancelled due to weather."
                        required
                    />
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">
                        Send Alert to Team
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default QuickAlertView;
