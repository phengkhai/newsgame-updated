import TrackTimeDAO from "../dao/trackTimeDAO.js"

export default class TrackTimeController{
    //get the Play Time for specific user
    static async apiGetUserPlayTime(req, res, next){
        //let filters = {}
        try{
            const userID = req.params.userID
            const { userTrackTimeList, userTotalRecords } = await TrackTimeDAO.getUserPlayTimes(userID)
            res.json({
                status: "Success",
                response: userTrackTimeList,
                totalUserPlayTimeRecord: userTotalRecords
            })
        }
        catch (e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to find the play time for this user",
                error: e.message
            })
        }
    }

    //get the Play Time based on difficulty
    static async apiGetPlayTimeByDifficulty(req, res, next){
        //let filters = {}
        try{
            console.log(req.params.difficulty)
            const difficulty = req.params.difficulty
            const { difficultyTrackTimeList, difficultyTotalRecords } = await TrackTimeDAO.getAllDifficultyPlayTimes(difficulty)
            res.json({
                status: "Success",
                response: difficultyTrackTimeList,
                totalPlayTimeByDiffRecord: difficultyTotalRecords
            })
        }
        catch (e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to find the play time for this difficulty",
                error: e.message
            })
        }
    }

    //get all the data in the Track Time Collection
    static async apiGetAllUserPlayTime(req, res, next){
        try{
            const { trackTimeList, totalRecords } = await TrackTimeDAO.getAllPlayTimes()
            res.json({
                status: "Success",
                response: trackTimeList,
                totalPlayTimeRecord: totalRecords
            })
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to get all track time from database",
                error: e.message
            })
        }
    }

    //Create a new data for every time the user press the link
    static async apiCreateUserTrackTime(req, res, next){
        try{
            const userID = req.body.userID
            const difficulty = req.body.difficulty
            const isBossRoom = req.body.isBossRoom
            const trackTime = req.body.trackTime
            const scoreObtained = req.body.scoreObtained //score of player for only this section of game/quiz
            const resCreatePlayTime = await TrackTimeDAO.createUserPlayTime(userID, difficulty, isBossRoom, trackTime, scoreObtained)
            if(resCreatePlayTime){
                res.json({
                    status: "Success",
                    message: "Track Time created"
                })
            }
            else{
                res.json({
                    status: "Failed",
                    message: "Unable to create Track Time!"
                })
            }
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to create track time for user",
                error: e.message
            })
        }
    }
}