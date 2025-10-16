import User from '../../models/user.model.js';  

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

const updateMe = async (req, res) => {
    try {
        const { username, phone_number } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user.userId,
            { username, phone_number },
            { new: true, runValidators: true }
        ).select('-password');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, user: updated });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

const deleteMe = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.user.userId);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

export default { getMe, updateMe, deleteMe };