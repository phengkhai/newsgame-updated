import nodemailer from "nodemailer"

export default class EmailSent{
    static async sendEmail(email, activateTok){
        try{
            const transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com",
                port: 587,
                auth:{
                    user: process.env.EMAILADD,
                    pass: process.env.EMAILPASS
                }
            })
            const options = {
                from:  `Fake News Detective <${process.env.EMAILADD}>`,
                to: email,
                subject: "Activation for Web Game",
                text:  `Please click on the link to activate your account
                            https://fakenewsdetective.com/#/confirm/${activateTok}` // here put the activation url from frontend
                    //the activation link currently cannot use in browser becuz browser is get method, need to change to put method
                    //at frontend when connecting
            }

            transporter.sendMail(options, function (err, info){
                if(err){
                    console.log(err)
                    return
                }
            })
        }
        catch(e){
            console.error(e.message)
            return {error: e}
        }
    }

    static async sendChangePassEmail(email, userID){
        try{
            const transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com",
                port: 587,
                auth:{
                    user: process.env.EMAILADD,
                    pass: process.env.EMAILPASS
                }
            })
            const options = {
                from:  `Fake News Detective<${process.env.EMAILADD}>`,
                to: email,
                subject: "Change Password",
                text:  `You have request to change password. Please click on the following link to change password
                            https://fakenewsdetective.com/#/changepassword/${userID}
                        If you do not request for such request, please ignore this message.` // here put the activation url from frontend
                    //the activation link currently cannot use in browser becuz browser is get method, need to change to put method
                    //at frontend when connecting
                    //http://localhost:5000/api/news/user/changePass/${userID}
            }

            transporter.sendMail(options, function (err, info){
                if(err){
                    console.log(err)
                    return
                }
            })
        }
        catch(e){
            console.error(e.message)
            return {error: e}
        }
    }
}