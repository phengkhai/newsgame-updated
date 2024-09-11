import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID

let trackTimes

export default class TrackTimeDAO{
    //connection to Track_Time collection
    static async injectDB(conn){
        if(trackTimes){
            return
        }
        try{
            trackTimes = await conn.db(process.env.RESTREVIEWS_NS).collection("Track_Times")
        }
        catch(e){
            console.error(`Unable to establish collection handles in trackTimeDAO: ${e}`)
        }
    }

    //get the play time by the user
    static async getUserPlayTimes(userID){
        try{
            let query = ObjectID(userID)
            let cursor = await trackTimes.find({userID: query})
            const userTrackTimeList = await cursor.toArray()
            const userTotalRecords = await userTrackTimeList.length
            return { userTrackTimeList, userTotalRecords}
        }
        catch(e){
            console.error(`Unable to get user's Play Time: ${e}`)
            return { userTrackTimeList: [], userTotalRecords: 0}
        }
    }

    //get the play time by the difficulty
    static async getAllDifficultyPlayTimes(difficulty){
        try{
            let query = difficulty
            let cursor = await trackTimes.find({difficulty: query})
            const difficultyTrackTimeList = await cursor.toArray()
            const difficultyTotalRecords = await difficultyTrackTimeList.length
            return { difficultyTrackTimeList, difficultyTotalRecords}
        }
        catch(e){
            console.error(`Unable to get difficulty's play time: ${e}`)
            return { difficultyTrackTimeList: [], difficultyTotalRecords: 0}
        }
    }

    //get all the Play Time by all users
    static async getAllPlayTimes(){
        try{
            let cursor
            cursor = await trackTimes.find()
            const trackTimeList = await cursor.toArray()
            const totalRecords = await trackTimes.countDocuments()
            return { trackTimeList, totalRecords }
        }
        catch(e){
            console.error(`Unable to get all track Links: ${e}`)
            return { trackLinksList: [], totalRecords: 0 }
        }
    }

    //create the track time by user
    static async createUserPlayTime(userID, difficulty, isBossRoom, trackTime, scoreObtained){
        try{
            const createTrackTime = await trackTimes.insertOne({
                userID: ObjectID(userID),
                difficulty: difficulty,
                isBossRoom: isBossRoom,
                trackTime: trackTime,
                scoreObtained: scoreObtained
            })
            return true
        }
        catch(e){
            console.error(`Unable to create track time: ${e}`)
            return false
        }
    }
}