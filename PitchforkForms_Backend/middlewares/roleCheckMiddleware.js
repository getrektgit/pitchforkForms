//Megnázi, hogy a bejelentkezett felhasználó admin-e
const isAdmin=(req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(401).json({message:"Access denied! Only admin role!"})
    }
    next()
}

module.exports = isAdmin