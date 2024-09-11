import ScoreDAO from "../dao/scoreDAO.js"
import UserDAO from "../dao/userDAO.js"
import UserCtrl from "./userController.js"

export default class ScoreController{
    //creating and adding a new user score
    static async createScore(userID){
        try{
            let easyScore = 0 
            let mediumScore = 0 
            let hardScore = 0

            const totalScore = easyScore + mediumScore + hardScore
            const ScoreResponse = await ScoreDAO.addScore(
                userID, 
                easyScore, 
                mediumScore,
                hardScore,
                totalScore
            )
        }
        catch(e){
            console.error(`Unable to create score: ${e}`)
            return {error:e}
        }
    }

    //retrieving the user score when signin and clicks on profile page
    static async retrieveUserScore(req, res, next){
        try{
            const userID = req.params.userID
            const userScoreRes = await ScoreDAO.getUserScore(userID)
            res.json({
                easyScores: userScoreRes.easyScore,
                mediumScores: userScoreRes.mediumScore,
                hardScores: userScoreRes.hardScore,
                totalScores: userScoreRes.totalScore
            }) 
        }
        catch(e){
            console.error(`Unable to get user's scores: ${e}`)
            return {error:e}
        }
    }

    //updating the easy score and level
    static async apiUpdateEasyScoreNLevel(req, res, next){
        try{
            const userID = req.body.userID
            const newScore = req.body.newScore
            const scoreResponse = await ScoreDAO.updateEasyScore(userID, newScore)
            const levelResponse = await UserCtrl.unlockLevel(userID, 1)
            res.json({
                status: "Success",
                levelMessage: levelResponse,
                scoreMessage: scoreResponse
            })
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                error: e.message
            })
        }
    }

    //updating the medium score and level
    static async apiUpdateMediumScoreNLevel(req, res, next){
        try{
            const userID = req.body.userID
            const newScore = req.body.newScore
            const scoreResponse = await ScoreDAO.updateMediumScore(userID, newScore)
            const levelResponse = await UserCtrl.unlockLevel(userID, 2)
            res.json({
                status: "Success",
                levelMessage: levelResponse,
                scoreMessage: scoreResponse
            })
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                error: e.message
            })
        }
    }

    //updating the hard score and level
    static async apiUpdateHardScoreNLevel(req, res, next){
        try{
            const userID = req.body.userID
            const newScore = req.body.newScore
            const scoreResponse = await ScoreDAO.updateHardScore(userID, newScore)
            const levelResponse = await UserCtrl.unlockLevel(userID, 3)
            res.json({
                status: "Success",
                levelMessage: levelResponse,
                scoreMessage: scoreResponse
            })
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                error: e.message
            })
        }
    }

    //retrieving the top 10 score from score database and the top 10 players from user database
    static async apiGetTop10Score(req, res, next){
        try{
            const top10Response = await ScoreDAO.getTop10Score()
            const top10Player = await UserDAO.getTop10Player(top10Response)
            let response = {
                top10List: top10Response,
                top10Players: top10Player
            }
            res.json(response)
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                error: e.message
            })
        }
    }
}