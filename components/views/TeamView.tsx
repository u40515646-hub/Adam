import React, { useState } from 'react';
import { useApp } from '../../App';
import { Role, User } from '../../types';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import Notification from '../Notification';

interface NotificationState {
    message: string | null;
    type: 'success' | 'error';
}

const TeamView: React.FC = () => {
    const { users, addSwimmer, currentUser, deleteUser } = useApp();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [newSwimmerName, setNewSwimmerName] = useState('');
    const [captainPin, setCaptainPin] = useState('');
    const [notification, setNotification] = useState<NotificationState>({ message: null, type: 'success' });

    const captains = users.filter(u => u.role === Role.Captain);
    const swimmers = users.filter(u => u.role === Role.Player);

    const handleAddSwimmer = (e: React.FormEvent) => {
        e.preventDefault();
        addSwimmer(newSwimmerName);
        setNewSwimmerName('');
        setAddModalOpen(false);
        setNotification({ message: `Swimmer "${newSwimmerName}" added successfully.`, type: 'success' });
    };

    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (userToDelete) {
            const success = deleteUser(userToDelete.id, captainPin);
            if (success) {
                setNotification({ message: `User "${userToDelete.name}" has been deleted.`, type: 'success' });
            } else {
                setNotification({ message: 'Incorrect PIN. User deletion failed.', type: 'error' });
            }
        }
        setDeleteModalOpen(false);
        setUserToDelete(null);
        setCaptainPin('');
    };
    
    const UserCard: React.FC<{ user: User, index: number }> = ({ user, index }) => (
        <Card 
            className="flex items-center justify-between animate-fade-in-up"
            style={{ animationDelay: `${index * 75}ms`}}
        >
            <div className="flex items-center space-x-4">
                <Avatar user={user} size="lg" />
                <div>
                    <p className="font-bold text-lg text-white">{user.name}</p>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${user.isActive ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                </div>
            </div>
             {currentUser?.role === Role.Captain && currentUser.id !== user.id && (
                <button 
                    onClick={() => openDeleteModal(user)} 
                    className="p-2 rounded-full text-gray-400 hover:bg-error/20 hover:text-error transition-colors"
                >
                    <Icon name="close" className="w-5 h-5" />
                </button>
            )}
        </Card>
    );

    return (
        <div>
             <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: null, type: 'success' })} />
            {currentUser?.role === Role.Captain && (
                <div className="mb-6 text-right">
                    <button 
                        onClick={() => setAddModalOpen(true)}
                        className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                    >
                         <Icon name="plus" className="w-5 h-5 mr-2"/>
                        Add Swimmer
                    </button>
                </div>
            )}
            
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Captains</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {captains.map((c, i) => <UserCard key={c.id} user={c} index={i} />)}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Swimmers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {swimmers.map((p, i) => <UserCard key={p.id} user={p} index={i} />)}
                </div>
            </section>

            {/* Add Swimmer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Swimmer">
                <form onSubmit={handleAddSwimmer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Swimmer's Full Name</label>
                        <input
                            type="text"
                            value={newSwimmerName}
                            onChange={(e) => setNewSwimmerName(e.target.value)}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">Add Swimmer</button>
                    </div>
                </form>
            </Modal>

             {/* Delete User Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Delete ${userToDelete?.name}?`}>
                <form onSubmit={handleDeleteUser} className="space-y-4">
                    <p className="text-gray-300">
                       Are you sure you want to delete this user? This action cannot be undone. 
                       Please enter your PIN to confirm.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Captain PIN</label>
                        <input
                            type="password"
                            value={captainPin}
                            onChange={(e) => setCaptainPin(e.target.value)}
                            className="w-full bg-base-300 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-error focus:outline-none"
                            required
                        />
                    </div>
                    <div className="pt-4 flex space-x-4">
                         <button type="button" onClick={() => setDeleteModalOpen(false)} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                         <button type="submit" className="w-full bg-error text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">Delete User</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeamView;
