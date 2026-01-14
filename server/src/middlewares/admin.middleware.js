export default function requireAdmin(req,res,next){
    const user = req.user;
    if(!user) return res.status(401).json({success: false, message: "Unauthorized"});
    if(user.role !== 'ADMIN'){
        return res.status(403).json({success: false, message: "Forbidden: Admins only"});
    }
    return next();
}