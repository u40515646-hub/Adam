import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Icon from '../common/Icon';
import Notification from '../Notification';
import { isApiConfigured, saveApiConfig } from '../../services/apiService';
import { getInitialStateForStorage } from '../../hooks/useAppData';


const SettingsView: React.FC = () => {
    const [serverId, setServerId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [configured, setConfigured] = useState(isApiConfigured());

    useEffect(() => {
        // Load existing config to display to the user if they wish to see it
        const storedConfig = localStorage.getItem('stormfinsApiConfig');
        if (storedConfig) {
            const { serverId: storedServerId, apiKey: storedApiKey } = JSON.parse(storedConfig);
            setServerId(storedServerId);
            setApiKey(storedApiKey || '');
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serverId.trim()) {
            setNotification({ message: 'Server ID cannot be empty.', type: 'error' });
            return;
        }
        saveApiConfig({ serverId, apiKey });
        setConfigured(true);
        setNotification({ message: 'Settings saved! The app will now reload to connect to the server.', type: 'success' });
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    const jsonTemplate = JSON.stringify(getInitialStateForStorage(), null, 2);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(jsonTemplate);
        setNotification({ message: 'JSON template copied to clipboard!', type: 'success' });
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <Notification message={notification?.message || null} type={notification?.type || 'success'} onDismiss={() => setNotification(null)} />
            <h2 className="text-2xl font-bold text-white mb-2">Server Sync Settings</h2>
            <p className="text-gray-400 mb-6">
                Connect the app to a central server to sync your team's data across all devices. 
                This allows for real-time collaboration. We recommend using a free service like <a href="https://www.npoint.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">npoint.io</a>.
            </p>

            <div className="my-8 p-4 bg-base-300/50 rounded-lg border border-white/10 space-y-3 animate-fade-in-up">
                <h3 className="font-bold text-white text-lg">How to set up your free server:</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                    <li>Go to <a href="https://www.npoint.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">npoint.io</a> in a new tab.</li>
                    <li>
                        Click the button below to copy the required JSON structure for your database.
                        <button onClick={copyToClipboard} className="text-sm bg-white/10 hover:bg-white/20 text-white font-semibold py-1 px-3 rounded-md ml-2 inline-flex items-center transition-transform hover:scale-105">
                            <Icon name="edit" className="w-4 h-4 mr-2" /> Copy Template
                        </button>
                    </li>
                    <li>Paste the copied text into the large text box on the npoint.io website.</li>
                    <li>Click the green <span className="font-semibold text-success">"Create"</span> button.</li>
                    <li>You will be given a URL like: <code className="bg-black/50 p-1 rounded-sm">https://api.npoint.io/a1b2c3d4e5f6</code>.</li>
                    <li>Copy just the random ID part (e.g., <code className="bg-black/50 p-1 rounded-sm">a1b2c3d4e5f6</code>) and paste it into the "Server ID" field below.</li>
                </ol>
            </div>

            {configured && (
                 <div className="bg-success/20 border border-success/50 text-success p-4 rounded-lg mb-6 flex items-center space-x-3">
                    <Icon name="dashboard" className="w-6 h-6" />
                    <p>App is connected to a server. Data is being synced automatically.</p>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Server ID / npoint.io ID</label>
                    <input
                        type="text"
                        value={serverId}
                        onChange={(e) => setServerId(e.target.value)}
                        className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="e.g., a1b2c3d4e5f6"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">API Key (Optional)</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Leave blank if not needed"
                    />
                     <p className="text-xs text-gray-500 mt-1">Note: npoint.io does not require an API key.</p>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">
                        Save and Connect
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default SettingsView;
