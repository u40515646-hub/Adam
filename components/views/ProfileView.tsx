import React, { useRef } from 'react';
import { useApp } from '../../App';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Icon from '../common/Icon';
import { Award } from '../../types';
import AnimatedStat from '../common/AnimatedStat';

const ProfileView: React.FC = () => {
    const { currentUser, updateUserAvatar, grantedAwards } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) return null;

    const myAwards = grantedAwards.filter(ga => ga.userId === currentUser.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
            <p className="text-4xl font-bold text-primary">
                <AnimatedStat value={value} />
                <span className="text-2xl text-gray-400">{unit}</span>
            </p>
            <p className="text-gray-400 mt-2">{label}</p>
        </Card>
    );

    const AwardIcon: React.FC<{icon: Award['icon'], className?: string}> = ({ icon, className = 'w-6 h-6' }) => {
        const iconColorMap: Record<Award['icon'], string> = {
            trophy: 'text-yellow-400',
            star: 'text-blue-400',
            bolt: 'text-purple-400',
            heart: 'text-pink-500',
            dashboard: 'text-teal-400',
            team: 'text-indigo-400',
            profile: 'text-green-400',
            leaderboard: 'text-orange-400',
        };
        return <Icon name={icon} className={`${className} ${iconColorMap[icon]}`} />;
    };

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

            <div>
                <h2 className="text-2xl font-bold mb-4 text-white animate-fade-in-up" style={{animationDelay: '200ms'}}>My Awards</h2>
                {myAwards.length === 0 ? (
                    <Card className="text-center animate-fade-in-up" style={{animationDelay: '300ms'}}>
                        <p className="text-gray-400">You haven't received any awards yet. Keep pushing!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAwards.map((granted, index) => (
                            <Card
                                key={granted.id}
                                className="flex flex-col animate-fade-in-up"
                                style={{ animationDelay: `${300 + index * 100}ms` }}
                            >
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-base-300 rounded-full mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                        <AwardIcon icon={granted.award.icon} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{granted.award.title}</h3>
                                        <p className="font-semibold text-sm text-primary">+{granted.award.points} pts</p>
                                    </div>
                                </div>
                                 <p className="text-sm text-gray-400 flex-grow">{granted.award.description}</p>
                                 {granted.reason && (
                                     <div className="mt-3 pt-3 border-t border-white/10 italic">
                                        <p className="text-sm text-gray-300">"{granted.reason}"</p>
                                     </div>
                                 )}
                                 <div className="text-xs text-gray-500 pt-2 mt-3 text-right">
                                     From {granted.grantedByUserName}
                                 </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;