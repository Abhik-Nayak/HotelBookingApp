import jwt from "jsonwebtoken";

export const verifyToken = (req,res, next)=> {
    const token = req.cookies.access_token;
    if(!token){
        return  res.status(401).json("You are not authenticated!");
    }

    jwt.verify(token,process.env.JWT,(err, user)=> {
        if(err) return res.status(403).json("Forbidden!");
        req.user = user;
        next()
    });
}

export const verifyUser = (req,res,next) => {
    verifyToken(req,res,next, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            if(err) return res.status(403).json("Forbidden!");
        }
    })
}

export const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,next, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            if(err) return res.status(403).json("Forbidden!");
        }
    })
}