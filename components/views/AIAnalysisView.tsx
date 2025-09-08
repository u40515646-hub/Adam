import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import { User } from '../../types';

interface AIChatMessage {
    role: 'user' | 'model';
    text: string;
}

const AIAnalysisView: React.FC = () => {
    const { getAI, currentUser } = useApp();
    const [chat, setChat] = useState<Chat | null>(null);
    const [conversation, setConversation] = useState<AIChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const aiUser: User = { 
      id: 0, name: 'Swimsfans AI', role: 'Player' as any, isActive: true, age: 0, 
      avatar: 'ai_avatar', // special key for avatar
      stats: { attendance: 0, topSpeed: 0, endurance: 0 }, points: 0 
    };

    useEffect(() => {
        try {
            const ai = getAI();
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are Swimsfans AI, a specialized assistant for swimmers and coaches. Your expertise covers swimming techniques, athletic performance, nutrition, and workout planning. Provide concise, helpful, and encouraging answers.`,
                },
            });
            setChat(newChat);
             setConversation([{ role: 'model', text: "Hello! I'm Swimsfans AI. How can I help you improve your performance today?" }]);
        } catch (error) {
            console.error("Failed to initialize AI:", error);
            setConversation([{ role: 'model', text: "Sorry, I'm having trouble connecting to the AI service right now." }]);
        }
    }, [getAI]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: AIChatMessage = { role: 'user', text: input };
        setConversation(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result: GenerateContentResponse = await chat.sendMessage({ message: input });
            const modelMessage: AIChatMessage = { role: 'model', text: result.text };
            setConversation(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: AIChatMessage = { role: 'model', text: "I apologize, but I encountered an error trying to respond." };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const AIBubble = () => (
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 bg-gradient-to-tr from-primary to-accent">
        <Icon name="ai" className="w-6 h-6"/>
      </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] bg-base-200/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <AIBubble />}
                         <div className={`max-w-md lg:max-w-2xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-base-300 text-gray-200 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                         <AIBubble />
                         <div className="bg-base-300 text-gray-200 rounded-bl-none p-4 rounded-2xl">
                             <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></span>
                             </div>
                         </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about swimming, nutrition, or training..."
                        className="w-full bg-base-300 border border-white/10 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-primary p-3 rounded-full text-white hover:bg-primary-focus transition-colors disabled:opacity-50" disabled={isLoading}>
                        <Icon name="send" className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAnalysisView;
