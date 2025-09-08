import React, { useState } from 'react';
import { useApp } from '../App';
import { Role } from '../types';
import Notification from './Notification';
import Icon from './common/Icon';

const AuthScreen: React.FC = () => {
    const { login, activateSwimmer, createCaptain } = useApp();
    const [activeTab, setActiveTab] = useState<'login' | 'createCaptain' | 'activateSwimmer'>('login');
    
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
        const success = login(loginName, loginPinOrPassword, loginRole, loginCaptainPassword);
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
        const success = createCaptain(captainName, captainPin, captainPassword);
        if (success) {
            // Automatically log the new captain in
            login(captainName, captainPin, Role.Captain, captainPassword);
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
        const success = activateSwimmer(swimmerName, swimmerPassword);
        if (success) {
            setSuccess('Account activated successfully! You can now log in.');
            setSwimmerName('');
            setSwimmerPassword('');
            setSwimmerConfirmPassword('');
            setActiveTab('login');
        } else {
            setError('Could not activate account. Make sure your name is correct and the account is not already active.');
        }
    };
    
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
                            <input type="text" value={loginName} onChange={e => setLoginName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                        </div>
                        {loginRole === Role.Captain ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">PIN</label>
                                    <input type="password" placeholder="4-Digit PIN" value={loginPinOrPassword} onChange={e => setLoginPinOrPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required maxLength={4} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <input type="password" placeholder="Password" value={loginCaptainPassword} onChange={e => setLoginCaptainPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input type="password" value={loginPinOrPassword} onChange={e => setLoginPinOrPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                            </div>
                        )}
                        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">Login</button>
                    </form>
                );
            case 'createCaptain':
                 return (
                    <form onSubmit={handleCreateCaptain} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Captain Name</label>
                            <input type="text" value={captainName} onChange={e => setCaptainName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">4-Digit PIN</label>
                                <input type="password" value={captainPin} onChange={e => setCaptainPin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required maxLength={4} />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input type="password" value={captainPassword} onChange={e => setCaptainPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">Create Account</button>
                    </form>
                );
            case 'activateSwimmer':
                return (
                    <form onSubmit={handleActivateSwimmer} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name (as added by Captain)</label>
                            <input type="text" value={swimmerName} onChange={e => setSwimmerName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                            <input type="password" value={swimmerPassword} onChange={e => setSwimmerPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                            <input type="password" value={swimmerConfirmPassword} onChange={e => setSwimmerConfirmPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" required />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">Activate Account</button>
                    </form>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-100 animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
             <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

            <Notification message={error} type="error" onDismiss={() => setError(null)} />
            <Notification message={success} type="success" onDismiss={() => setSuccess(null)} />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                     <h1 className="text-5xl font-bold text-white tracking-wider">Stormfins</h1>
                     <p className="text-gray-400 mt-2">Your Team's Digital Hub</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 animate-pop-in">
                    <div className="flex border-b border-white/10 mb-6">
                        <button onClick={() => setActiveTab('login')} className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'login' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>Login</button>
                        <button onClick={() => setActiveTab('createCaptain')} className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'createCaptain' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>Create Captain</button>
                        <button onClick={() => setActiveTab('activateSwimmer')} className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 ${activeTab === 'activateSwimmer' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>Activate Swimmer</button>
                    </div>
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;