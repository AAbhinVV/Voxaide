
export default function notesMiddleware (res,res,next){
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized"})
    }

    if(req.method === "POST" && !req.file){
        return res.status(400).json({ message: "Audio file is required"})
    }
    

    next();
}