import React, { useState } from 'react';
import { useApp } from '../App';
import { Role } from '../types';
import Notification from './Notification';
import Icon from './common/Icon';

const AuthScreen: React.FC = () => {
    const { login, activateSwimmer, createCaptain } = useApp();
    const [activeTab, setActiveTab] = useState<'login' | 'createCaptain' | 'activateSwimmer'>('login');
    const [showOnboarding, setShowOnboarding] = useState(true);
    
    // Login State
    const [loginRole, setLoginRole] = useState<Role>(Role.Player);
    const [loginName, setLoginName] = useState('');
    const [loginPinOrPassword, setLoginPinOrPassword] = useState('');
    const [loginCaptainPassword, setLoginCaptainPassword] = useState('');


    // Create Captain State
    const [captainName, setCaptainName] = useState('');
    const [captainPin, setCaptainPin] = useState('');
    const [captainPassword, setCaptainPassword] = useState('');

    // Activate Swimmer State
    const [swimmerName, setSwimmerName] = useState('');
    const [swimmerPassword, setSwimmerPassword] = useState('');
    const [swimmerConfirmPassword, setSwimmerConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = login(loginName.trim(), loginPinOrPassword, loginRole, loginCaptainPassword);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleCreateCaptain = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if(captainPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if(captainPin.length !== 4 || !/^\d{4}$/.test(captainPin)) {
            setError('PIN must be exactly 4 digits.');
            return;
        }
        const trimmedName = captainName.trim();
        const success = createCaptain(trimmedName, captainPin, captainPassword);
        if (success) {
            setSuccess('Account created successfully! Logging you in...');
            login(trimmedName, captainPin, Role.Captain, captainPassword);
        } else {
            setError('A user with this name already exists.');
        }
    };

    const handleActivateSwimmer = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (swimmerPassword !== swimmerConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if(swimmerPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        const trimmedName = swimmerName.trim();
        const success = activateSwimmer(trimmedName, swimmerPassword);
        if (success) {
            setSuccess('Account activated successfully! Logging you in...');
            login(trimmedName, swimmerPassword, Role.Player);
        } else {
            setError('Could not activate account. Make sure your name is correct and the account is not already active.');
        }
    };
    
    if (showOnboarding) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100 p-4 animate-fade-in">
                <div className="text-center max-w-2xl">
                    <h1 className="text-5xl font-bold text-white mb-4">Welcome to <span className="gradient-text">Stormfins</span></h1>
                    <p className="text-lg text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        The ultimate digital platform for your swimming team. Manage schedules, track performance, and communicate seamlessly. Everything you need, all in one place.
                    </p>
                    <button 
                        onClick={() => setShowOnboarding(false)}
                        className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-all duration-300 shadow-lg text-lg transform hover:scale-105 animate-fade-in-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        )
    }

    const renderForm = () => {
        switch (activeTab) {
            case 'login':
                return (
                    <form onSubmit={handleLogin} className="space-y-6">
                         <div className="flex justify-center p-1 bg-base-300/50 rounded-full">
                            <button type="button" onClick={() => setLoginRole(Role.Player)} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${loginRole === Role.Player ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}>Swimmer</button>
                            <button type="button" onClick={() => setLoginRole(Role.Captain)} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${loginRole === Role.Captain ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}>Captain</button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                            <input type="text" value={loginName} onChange={e => setLoginName(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                        {loginRole === Role.Player ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input type="password" value={loginPinOrPassword} onChange={e => setLoginPinOrPassword(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">4-Digit PIN</label>
                                    <input type="password" value={loginPinOrPassword} onChange={e => setLoginPinOrPassword(e.target.value)} required maxLength={4} className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <input type="password" value={loginCaptainPassword} onChange={e => setLoginCaptainPassword(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                                </div>
                            </div>
                        )}
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105">Login</button>
                    </form>
                );
            case 'createCaptain':
                 return (
                    <form onSubmit={handleCreateCaptain} className="space-y-4">
                        <p className="text-sm text-gray-400 text-center">Create a new captain account to manage your team.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input type="text" value={captainName} onChange={e => setCaptainName(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">4-Digit PIN</label>
                            <input type="password" value={captainPin} onChange={e => setCaptainPin(e.target.value)} required maxLength={4} className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Master Password</label>
                            <input type="password" value={captainPassword} onChange={e => setCaptainPassword(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105">Create Account</button>
                    </form>
                );
            case 'activateSwimmer':
                 return (
                    <form onSubmit={handleActivateSwimmer} className="space-y-4">
                        <p className="text-sm text-gray-400 text-center">Activate your account to get started.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name (as added by your captain)</label>
                            <input type="text" value={swimmerName} onChange={e => setSwimmerName(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Create New Password</label>
                            <input type="password" value={swimmerPassword} onChange={e => setSwimmerPassword(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                            <input type="password" value={swimmerConfirmPassword} onChange={e => setSwimmerConfirmPassword(e.target.value)} required className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105">Activate Account</button>
                    </form>
                );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
            <Notification message={error} type="error" onDismiss={() => setError(null)} />
            <Notification message={success} type="success" onDismiss={() => setSuccess(null)} />
            <div className="w-full max-w-md mx-auto">
                 <div className="text-center mb-8 animate-fade-in-down">
                    <h1 className="text-4xl font-bold gradient-text">Stormfins</h1>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 animate-pop-in">
                    <div className="mb-6">
                        <div className="flex border-b border-white/10">
                            <button onClick={() => setActiveTab('login')} className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>Login</button>
                            <button onClick={() => setActiveTab('activateSwimmer')} className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'activateSwimmer' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>Activate</button>
                            <button onClick={() => setActiveTab('createCaptain')} className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'createCaptain' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>New Captain</button>
                        </div>
                    </div>
                    <div className="animate-fade-in">
                       {renderForm()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;