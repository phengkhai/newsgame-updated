import mongodb from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const ObjectID = mongodb.ObjectID

let users 

export default class UsersDAO{
    //connection to the user database
    static async injectDB(conn){
        if(users){
            return
        }
        try{
            users = await conn.db(process.env.RESTREVIEWS_NS).collection("Users")
        } 
        catch (e){
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    //check whether the database alrd contains the username or email
    // static async checkUserExists(username, email){
    static async checkUserExists(username){
        const existUsername = await users.findOne({username})
        if(existUsername){
            const responseMssg = "User with the provided username already exists."
            
            return responseMssg
        }
        // const existEmail = await users.findOne({email})
        // if(existEmail){
        //     const responseMssg = "User with the provided email already exists."
        //     return responseMssg
        // }
        return true 
    }

    //add the user to the database
    static async addUser(username, password){
    // static async addUser(name, username, email, password, activateTok){
        try{
            //hashing password
            const saltRounds =  parseInt(process.env.SALTROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds) 

            const userDoc = {
                // name: name,
                username: username, 
                // email: email,
                password : hashedPassword, 
                // isActivate: false,
                // activationToken: activateTok,
                // character: 0,
                level: 0
            }
            return await users.insertOne(userDoc)
        } catch (e){
            console.error(`Unable to create user: ${e}`)
            return {error:e}
        }
    }

    //activating the user account
    // static async activateAcct(activateTok){
    //     try{
    //         const updateUserActivation = await users.updateOne(
    //             {activationToken: activateTok},
    //             {$set: {isActivate: true}}
    //         )
    //     }
    //     catch(e){
    //         console.log(`unable to find user: ${e}`)
    //         return {error:e}
    //     }
    // }

    //login validate whether the username and password given is correct
    static async validateUser(username, password){
        //const existingUser = await users.findOne({username})
        const existingUser = await users.findOne({username: new RegExp("^" + username + "$", "i")})
        if(existingUser){
            try{  
                // const userActivate = existingUser.isActivate
            
                const hashedPW = existingUser.password
                const comparedRes = await bcrypt.compare(password, hashedPW)
                if(comparedRes){
                    // if(!userActivate){
                    //     return {
                    //         status: "Failed",
                    //         message: "Please activate your account from your email to log in!"
                    //     }
                    // }
                    const token = jwt.sign({username: existingUser.username}, process.env.TOKEN_AUTH, {expiresIn: process.env.JWT_EXPIRY_TIME})
                    const refreshToken = jwt.sign({username: existingUser.username}, process.env.TOKEN_AUTH_SECRET2, {expiresIn: process.env.JWT_EXPIRY_REFRESH})
                    return {
                        status: "Success",
                        token: token,
                        refreshToken: refreshToken,
                        user: existingUser
                    }
                    
                }
                else{
                    return {
                        status: "Failed",
                        message: "Invalid username or password"
                    }
                }
            }
            catch (e) {
                return {
                    status: "Failed",
                    message: e.message + "An error occurred while comparing password"
                }
            }
        }
        else{
            return {
                status: "Failed",
                message: "Invalid username or password"
            }
        }
    }

    //use email to find the user from database to be use for email
    // static async getUserBasedOnEmail(email){
    //     try{
    //         const existingUser = await users.findOne({email})
    //         if(existingUser){
    //             return existingUser._id
    //         } 
    //         else{
    //             return false
    //         }
    //     }
    //     catch(e){
    //         console.log(`Unable to find email: ${e.message}`)
    //         return false
    //     }
    // }

    //changing the user's password
    // static async changePass(userID, newPassword){
    //     try{
    //         const saltRounds =  parseInt(process.env.SALTROUNDS);
    //         const newHashedPassword = await bcrypt.hash(newPassword, saltRounds) 
    //         const updateUserPass = await users.updateOne(
    //             {_id: ObjectID(userID)},
    //             {$set: {password: newHashedPassword}}
    //         )
    //         return true
    //     }
    //     catch(e){
    //         console.log("Unable to change password")
    //         return {error:e}
    //     }
    // }

    //change password when logged in
    // static async changePassLoggedIn(userID, oldPass, newPass){
    //     try{
    //         const existingUser = await users.findOne({_id: ObjectID(userID)})
    //         if(existingUser){
    //             const comparedRes = await bcrypt.compare(oldPass, existingUser.password)
    //             if(comparedRes){
    //                 const saltRounds =  parseInt(process.env.SALTROUNDS);
    //                 const newHashedPassword = await bcrypt.hash(newPass, saltRounds) 
    //                 const updateUserPass = await users.updateOne(
    //                     {_id: ObjectID(userID)},
    //                     {$set: {password: newHashedPassword}}
    //                 )
    //             }
    //             else{
    //                 return {
    //                     status: "Failed",
    //                     message: "Incorrect Password!"
    //                 }
    //             }
    //             return true
    //         }
    //         else{
    //             return {
    //                 status: "Failed",
    //                 message: "User does not exists!"
    //             }
    //         }
    //     }
    //     catch(e){
    //         console.log("Unable to change password")
    //         return {message:e}
    //     }
    // }

    //character selecting
    // static async changeCharacter(username, character){
    //     try{   
    //         const updateUserChar = await users.updateOne(
    //             {username: username},
    //             {$set: {character: character}}
    //         )
    //         return true
    //     }
    //     catch(e){
    //         console.log(`Unable to update character: ${e.message}`)
    //         return false
    //     }
    // }

    //update the user's level
    static async updateLevel(userID, difficulty){
        try{   
            const user = await users.findOne({_id: ObjectID(userID)})
            if(user.level<difficulty){
                const updateUserChar = await users.updateOne(
                    {_id: ObjectID(userID)},
                    {$set: {level: difficulty}}
                )
                return "Level Updated!"
            }
            else{
                return "Level not updated!"
            }
        }
        catch(e){
            console.log(`Unable to update level: ${e.message}`)
            return false
        }
    }

    // get the top 10 players with highest score
    static async getTop10Player(top10ScoreArray){
        var top10PlayerArr = []
        try{
            for(let i=0; i<10; i++){
                try{
                    const currPlayer = await users.findOne({_id:ObjectID(top10ScoreArray[i].userID)})
                    top10PlayerArr.push(currPlayer.username)
                }
                catch(e){
                    return top10PlayerArr
                }
            }
            return top10PlayerArr
        }
        catch(e){
            console.error(`Unable to get top 10 player name: ${e}`)
            return {error:e}
        } 
    }
}