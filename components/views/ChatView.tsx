import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';
import { User, Role } from '../../types';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';

const ChatView: React.FC = () => {
    const { users, currentUser, conversations, sendDirectMessage } = useApp();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const availableUsers = currentUser?.role === Role.Captain
        ? users.filter(u => u.id !== currentUser.id)
        : users.filter(u => u.role === Role.Captain);

    useEffect(() => {
        if (window.innerWidth >= 768 && !selectedUser && availableUsers.length > 0) {
            setSelectedUser(availableUsers[0]);
        }
    }, [availableUsers, selectedUser]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, selectedUser]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && currentUser && selectedUser) {
            sendDirectMessage(currentUser.id, selectedUser.id, message);
            setMessage('');
        }
    };

    if (!currentUser) return null;
    
    if (availableUsers.length === 0) {
         return (
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl h-full flex flex-col items-center justify-center text-center p-4">
                 <Icon name="team" className="w-16 h-16 text-gray-600 mb-4" />
                 <h3 className="text-xl font-bold text-white">No Contacts Yet</h3>
                 <p className="text-gray-400">There are no other users available to chat with.</p>
             </div>
        );
    }
    
    const conversationId = selectedUser ? [currentUser.id, selectedUser.id].sort().join('-') : null;
    const currentMessages = conversationId ? conversations[conversationId] || [] : [];

    const UserList = () => (
        <div className={`w-full md:w-1/3 border-r border-white/10 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/10">
                <h2 className="font-bold text-lg text-white">Contacts</h2>
            </div>
            <ul className="flex-1 overflow-y-auto">
                {availableUsers.map(user => (
                    <li key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`flex items-center space-x-3 p-4 cursor-pointer transition-all duration-300 ${selectedUser?.id === user.id ? 'bg-primary/30' : 'hover:bg-white/10'}`}
                    >
                        <Avatar user={user} size="md" />
                        <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    const ChatWindow = () => (
         <div className={`w-full md:w-2/3 flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
                <>
                    <div className="flex items-center p-4 border-b border-white/10 bg-base-200/30">
                        <button onClick={() => setSelectedUser(null)} className="md:hidden mr-3 p-1 rounded-full hover:bg-white/10">
                            <Icon name="back" className="w-6 h-6" />
                        </button>
                        <Avatar user={selectedUser} size="md" />
                        <p className="font-bold text-lg text-white ml-3">{selectedUser.name}</p>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {currentMessages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-3 animate-pop-in ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                {msg.userId !== currentUser.id && <Avatar user={users.find(u => u.id === msg.userId) || null} size="sm" />}
                                <div className={`max-w-xs sm:max-w-sm lg:max-w-lg p-3 px-4 rounded-2xl shadow-md ${msg.userId === currentUser.id ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-lg' : 'bg-white/10 text-gray-200 rounded-bl-lg'}`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-white/10 bg-base-200/50">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                            <input type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-base-300 border border-transparent rounded-full px-5 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            />
                            <button type="submit" className="bg-primary p-3 rounded-full text-white hover:bg-primary-focus transition-colors">
                                <Icon name="send" className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="h-full hidden md:flex flex-col items-center justify-center text-center p-4">
                    <Icon name="chat" className="w-24 h-24 text-gray-700 mb-4" />
                    <h3 className="text-xl font-bold text-white">Select a conversation</h3>
                    <p className="text-gray-400">Choose someone from the list to start chatting.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-base-200 border border-white/10 rounded-2xl shadow-2xl h-[calc(100vh-150px)] flex overflow-hidden">
           <UserList />
           <ChatWindow />
        </div>
    );
};

export default ChatView;
