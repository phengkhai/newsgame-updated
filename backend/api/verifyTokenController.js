import jwt from "jsonwebtoken"

export default class tokenVer{
    static async verTok(req, res, next){
        const token = req.header("auth-token")
        if(!token){
            res.json({
                status: "Failed",
                message: "Access Denied"
            })
        }
        else{
            try{
                const verifiedToken = jwt.verify(token, process.env.TOKEN_AUTH)
                req.user = verifiedToken
                next()
            }
            catch(e){
                res.status(400).json({ 
                    status: "Failed",
                    error: e.message
                })
            }
        }
    }

    static async refreshTok(req, res, next){
        const token = req.header("auth-token")
        if(!token){
            res.json({
                status: "Failed",
                message: "Access Denied"
            })
        }
        else{
            try{
                const verifiedToken = jwt.verify(token, process.env.TOKEN_AUTH_SECRET2)
                req.user = verifiedToken
                next()
            }
            catch(e){
                res.status(400).json({ error: e.message})
            }
        }
    }

    static async generateTok(req, res, next){
        const username = req.body.username
        const newToken = jwt.sign({username: username}, process.env.TOKEN_AUTH, {expiresIn: process.env.JWT_EXPIRY_TIME})
        res.json({
            token: newToken 
        })
    }
}