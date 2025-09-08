import React, { useRef } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Icon from '../common/Icon';

const ProfileView: React.FC = () => {
    const { currentUser, updateUserAvatar } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) return null;

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserAvatar(currentUser.id, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const StatCard = ({ label, value, unit, index }: { label: string, value: number, unit: string, index: number }) => (
        <Card 
            className="text-center animate-fade-in-up"
            style={{ animationDelay: `${100 + index * 100}ms` }}
        >
            <p className="text-4xl font-bold text-primary">{value}<span className="text-2xl text-gray-400">{unit}</span></p>
            <p className="text-gray-400 mt-2">{label}</p>
        </Card>
    );

    return (
        <div className="space-y-8">
            <Card className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar user={currentUser} size="xl" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="edit" className="w-8 h-8 text-white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white">{currentUser.name}</h1>
                        <p className="text-xl text-primary font-semibold">{currentUser.role}</p>
                        <p className="text-gray-400 mt-2">Age: {currentUser.age}</p>
                    </div>
                </div>
            </Card>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-white animate-fade-in-up" style={{animationDelay: '100ms'}}>Performance Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard label="Attendance" value={currentUser.stats.attendance} unit="%" index={0} />
                    <StatCard label="Top Speed" value={currentUser.stats.topSpeed} unit=" m/s" index={1} />
                    <StatCard label="Endurance" value={currentUser.stats.endurance} unit=" m" index={2} />
                     <StatCard label="Leaderboard Points" value={currentUser.points} unit=" pts" index={3} />
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
