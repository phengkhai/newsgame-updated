import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID
import CryptoJS from "crypto-js"

let scores

export default class ScoreDAO{
    //connecting to the database in MongoDB Atlas
    static async injectDB(conn){
        if(scores){
            return
        }
        try{
            scores = await conn.db(process.env.RESTREVIEWS_NS).collection("Scores")
        } 
        catch (e){
            console.error(`Unable to establish collection handles in scoreDAO: ${e}`)
        }
    }

    //creating and adding a new user score to the database
    static async addScore(userID, easyScore, mediumScore, hardScore, totalScore){
        try{
            const scoreDOC = {
                userID: ObjectID(userID),
                easyScore: easyScore,
                mediumScore: mediumScore,
                hardScore: hardScore,
                totalScore: totalScore
            }
            return await scores.insertOne(scoreDOC)
        }
        catch(e){
            console.error(`Unable to post score: ${e}`)
            return {error:e}
        }
    }
    
    //getting user's score based on username when user clicks the profile page
    static async getUserScore(userID){
        try{
            const userScore = await scores.findOne({userID:ObjectID(userID)})
            return userScore
        }
        catch(e){
            console.error(`Unable to get user's scores: ${e}`)
            return {error:e}
        }
    }

    //updating easy level score
    static async updateEasyScore(userID, encryptedNewScore){
        try{
            var bytes  = CryptoJS.AES.decrypt(encryptedNewScore, process.env.CIPHERSECRETKEY)
            var newScore = parseInt(bytes.toString(CryptoJS.enc.Utf8))
            const oldScoreDetails = await scores.findOne({userID:ObjectID(userID)})
            if(isNaN(newScore)){
                return "Easy score not updated!"
            }
            if(oldScoreDetails.easyScore >= newScore){
                return "Easy score not updated!"
            }
            const newTotalScore = oldScoreDetails.totalScore - oldScoreDetails.easyScore + newScore
            const updateNewScore = await scores.updateOne(
                {userID: ObjectID(userID)},
                {$set: {easyScore: newScore, totalScore: newTotalScore}}
            )
            return "Easy score updated!"
        }
        catch (e) {
            console.error(`Unable to update score: ${e}`)
            return { error: e }
        }
    }

    //updating medium level score
    static async updateMediumScore(userID, encryptedNewScore){
        try{
            var bytes  = CryptoJS.AES.decrypt(encryptedNewScore, process.env.CIPHERSECRETKEY)
            var newScore = parseInt(bytes.toString(CryptoJS.enc.Utf8))
            const oldScoreDetails = await scores.findOne({userID:ObjectID(userID)})
            if(isNaN(newScore)){
                return "Medium score not updated!"
            }
            if(oldScoreDetails.mediumScore >= newScore){
                return "Medium score not updated!"
            }
            const newTotalScore = oldScoreDetails.totalScore - oldScoreDetails.mediumScore + newScore
            const updateNewScore = await scores.updateOne(
                {userID: ObjectID(userID)},
                {$set: {mediumScore: newScore, totalScore: newTotalScore}}
            )
            return "Medium score updated!"
        }
        catch (e) {
            console.error(`Unable to update score: ${e}`)
            return { error: e }
        }
    }

    //updating hard level score
    static async updateHardScore(userID, encryptedNewScore){
        try{
            var bytes  = CryptoJS.AES.decrypt(encryptedNewScore, process.env.CIPHERSECRETKEY)
            var newScore = parseInt(bytes.toString(CryptoJS.enc.Utf8))
            const oldScoreDetails = await scores.findOne({userID:ObjectID(userID)})
            if(isNaN(newScore)){
                return "Hard score not updated!"
            }
            if(oldScoreDetails.hardScore >= newScore){
                return "Hard score not updated!"
            }
            const newTotalScore = oldScoreDetails.totalScore - oldScoreDetails.hardScore + newScore
            const updateNewScore = await scores.updateOne(
                {userID: ObjectID(userID)},
                {$set: {hardScore: newScore, totalScore: newTotalScore}}
            )
            return "Hard score updated!"
        }
        catch (e) {
            console.error(`Unable to update score: ${e}`)
            return { error: e }
        }
    }

    //getting top 10 scores
    static async getTop10Score(){
        try{
            let query
            const scoreList = await scores.find(query)
            const top10Score = await scoreList.sort({totalScore: -1}).limit(10)
            return await top10Score.toArray()
        }
        catch (e) {
            console.error(`Unable to retrieve top 10 scores: ${e}`)
            return { error: e }
        }
    }
}