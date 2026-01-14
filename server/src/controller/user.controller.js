import sanitize from 'mongo-sanitize';
import User from '../../models/user.model.js';  
import { userSchema } from '../config/zod.js';

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

const updateMe = async (req, res) => {
    const sanitizedBody = sanitize(req.body);

    const validation =  userSchema.safeParse(sanitizedBody);

    if(!validation.success){
        const zodErrors = validation.error;

        let firstErrorMessage = "Validation Error"; 
        let allErrors = []

        if(zodErrors?.issues && Array.isArray(zodErrors.issues)){
            allErrors = zodErrors.issues.map((issue) => ({
                field: issue.path ? issue.path.join(".") : "unknown",
                message: issue.message || "validation error",
                code: issue.code
            }))

            firstErrorMessage = allErrors[0]?.message || "Validation Error";
        }

        return res.status(400).json({success: false, message: firstErrorMessage });
    }



    try {
        const { username, email  } = validation.data;;

        if(!username || !email){
            return  res.status(400).json({success: false, message: "No data to update"});
        }

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { username, email },
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
        const deleted = await User.findByIdAndDelete(req.user._id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

export default { getMe, updateMe, deleteMe };