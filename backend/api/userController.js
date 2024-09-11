import UserDAO from "../dao/userDAO.js"
import EmailSent from "./email.js"
import ScoreCtrl from "./scoreController.js"

export default class UserController {
    //user signup
    static async apiPostUserSignup(req, res, next){
        try{//here indicates the infomation requires by body
            // const name = req.body.name
            const username = req.body.username
            // const email = req.body.emailAddress
            const password = req.body.password 
            // let activateTok = '';
            // for (let i = 0; i < 25; i++) {
            //     activateTok += process.env.ACTIVATETOKEN[Math.floor(Math.random() * process.env.ACTIVATETOKEN.length )];
            // }
            // const notDuplicate = await UserDAO.checkUserExists(username, email)
            const notDuplicate = await UserDAO.checkUserExists(username)
            if(notDuplicate != true){
                res.json({
                    status: "Failed",
                    message: notDuplicate
                })
                return
            }
            const UserSignupResponse = await UserDAO.addUser(
                // name,
                username,
                // email,
                password,
                // activateTok
            )
            const createUserNewScore = await ScoreCtrl.createScore(UserSignupResponse.ops[0]._id)
            // const emailSending = await EmailSent.sendEmail(email, activateTok)
            res.json({
                status: "Success",
                message: "User added!"
            })
        } catch (e){
            res.status(500).json({ 
                status: "Failed",
                message: "Unable to Sign Up the user. Please try again!",
                error: e.message
            })
        }
    }

    //activate the account, change the isActivate to true
    // static async apiActivateAcct(req, res, next){
    //     try{
    //         const updateUserActivate = await UserDAO.activateAcct(req.params.activateTok)
    //         res.json({
    //             status: "Success",
    //             message: "Account Activated"
    //         })
    //     }
    //     catch (e){
    //         res.status(500).json({ 
    //             status: "Failed",
    //             message: "Unable to activate account!",
    //             error: e.message
    //         })
    //     }
    // }

    //user signin, check whether username and password is correct
    static async apiPostUserSignin(req, res, next){
        try{
            const username = req.body.username
            const password = req.body.password
            const userSigninResponse = await UserDAO.validateUser(username, password)
            if (userSigninResponse.status == "Success"){  
                res.json({
                    status: userSigninResponse.status,
                    token: userSigninResponse.token,
                    refreshToken: userSigninResponse.refreshToken,
                    user: {
                        userID: userSigninResponse.user._id,
                        username: userSigninResponse.user.username,
                        character: userSigninResponse.user.character,
                        level: userSigninResponse.user.level
                    }
                })
            }
            else{
                res.json({
                    status: userSigninResponse.status,
                    message: userSigninResponse.message
                })
            }
        }catch (e){
            res.status(500).json({ 
                status: "Failed",
                message: "Unable to sign in! Please try again",
                error: e.message
            })
        }
    }

    //link for forget password so user can change password from their email
    // static async apiSendChangePassEmail(req, res, next){
    //     try{
    //         const userEmailAddr = req.params.email
    //         const userID = await UserDAO.getUserBasedOnEmail(userEmailAddr)
    //         if (userID == false){
    //             res.json({
    //                 status: "Failed",
    //                 message: "Unable to find such email."
    //             })
    //         }
    //         else{
    //             const changePassEmailAddr = await EmailSent.sendChangePassEmail(userEmailAddr, userID)
    //             res.json({
    //                 status: "Success",
    //                 message: "Please check your email for the link"
    //             })
    //         }
    //     }
    //     catch (e){
    //         res.status(500).json({ 
    //             status: "Failed",
    //             message: "Unable to send link to email specified!",
    //             error: e.message
    //         })
    //     }
    // }

    //api to change the password, this link is access by user from email
    // static async apiChangePassword(req, res, next){
    //     try{
    //         const newPass = req.body.newPassword
    //         const changePassword = await UserDAO.changePass(req.params.userID, newPass)
    //         if(changePassword){    
    //             res.json({
    //                 status: "Success",
    //                 message: "Password updated!"
    //             })
    //         }
    //         else{
    //             res.json({
    //                 status: "Failed",
    //                 message: "An error occur when updating password!",
    //                 error: changePassword.error
    //             })
    //         }
    //     }
    //     catch (e){
    //         res.json({
    //             status: "Failed", 
    //             message: "Cannot update password",
    //             error: e.message
    //         })
    //     }
    // }

    //api to change password when logged in
    // static async apiLoggedInChangePassword(req, res, next){
    //     try{
    //         const userID = req.params.userID
    //         const oldPass = req.body.oldPass
    //         const newPass = req.body.newPass
    //         const changePassword = await UserDAO.changePassLoggedIn(userID, oldPass, newPass)
    //         if(changePassword == true){    
    //             res.json({
    //                 status: "Success",
    //                 message: "Password updated!"
    //             })
    //         }
    //         else{
    //             res.json({
    //                 status: "Failed",
    //                 message: "An error occur when updating password!",
    //                 error: changePassword.message
    //             })
    //         }
    //     }
    //     catch (e){
    //         res.json({
    //             status: "Failed", 
    //             message: "Cannot update password",
    //             error: e.message
    //         })
    //     }
    // }

    //api to change the character selected by user
    // static async apiChangeCharacter(req, res, next){
    //     try{
    //         const username = req.params.username
    //         const character = req.body.character //character check to be done in frontend
    //         const updateChar = await UserDAO.changeCharacter(username, character)
    //         if(updateChar == true){    
    //             res.json({
    //                 status: "Success",
    //                 message: "User character updated!"
    //             })
    //         }
    //     }
    //     catch (e){
    //         res.json({
    //             status: "Failed",
    //             message: "Unable to save character",
    //             error: e.message
    //         })
    //     }
    // }

    //function to change the user's level
    static async unlockLevel(userID, difficulty){
        try{
            const updateLvl = await UserDAO.updateLevel(userID, difficulty)
            return updateLvl
        }
        catch (e){
            return { error: e.message }
        }
    }
}