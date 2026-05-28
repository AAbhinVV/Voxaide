import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/exports.js'
import { Pencil, Check, X, User } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import { updateCurrentUserRequest } from '../../apis/users/apis'

function UserProfile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleEdit = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
        });
        setIsEditing(true);
        setError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            const updates = {};
            if (formData.username !== user?.username) updates.username = formData.username;
            if (formData.email !== user?.email) updates.email = formData.email;

            if (Object.keys(updates).length === 0) {
                setIsEditing(false);
                return;
            }

            const data = await updateCurrentUserRequest(updates);
            setUser(data.user);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const inputBase = 'text-center text-2xl px-3 py-2 bg-black/20 border-transparent transition delay-150 duration-300 ease-in-out hover:border-black/50 border-2 focus:border-purple-500 outline-none rounded-lg';

    return (
        <div className='overflow-hidden m-auto flex flex-col px-10 justify-center'>
            <div className="flex items-center justify-between">
                <div>
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-5xl font-accent font-medium tracking-widest italic inline-block self-start"
                    >
                        {user?.username || 'User'}'s&nbsp;&nbsp;
                    </motion.span>

                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-5xl font-headings font-normal tracking-widest inline-block"
                    >
                        Profile
                    </motion.span>
                </div>

                {!isEditing ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                    >
                        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                            <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                    </motion.div>
                )}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-500 text-center font-medium"
                >
                    {error}
                </motion.p>
            )}

            <div className='flex flex-col items-center mt-12 w-full px-4 h-auto gap-10'>
                <div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className='flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-purple-300 shadow-xl'
                    >
                        <User className="h-16 w-16 text-white" />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className='flex flex-col w-fit gap-15 my-20 justify-center items-center'>
                    <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                        <label htmlFor="profile-username" className='text-2xl font-body tracking-widest font-medium'>Display Name: </label>
                        <input 
                            type="text" 
                            id="profile-username"
                            name="username"
                            className={inputBase}
                            value={isEditing ? formData.username : (user?.username || '')}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />                
                    </div>
                    <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                        <label htmlFor="profile-email" className='text-2xl font-body tracking-widest font-medium justify-self-start'>Email: </label>
                        <input 
                            type="email" 
                            id="profile-email"
                            name="email"
                            className={inputBase}
                            value={isEditing ? formData.email : (user?.email || '')}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />                
                    </div>

                    <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                        <span className='text-2xl font-body tracking-widest font-medium'>Role: </span>
                        <span className='text-center text-2xl px-3 py-2 bg-black/10 rounded-lg tracking-wider'>
                            {user?.role || 'USER'}
                        </span>
                    </div>

                    <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                        <span className='text-2xl font-body tracking-widest font-medium'>Verified: </span>
                        <span className={`text-center text-2xl px-3 py-2 rounded-lg tracking-wider ${user?.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user?.isVerified ? '✓ Verified' : '✗ Unverified'}
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UserProfile
