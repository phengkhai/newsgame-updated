import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID

let trackLinks

export default class TrackLinkDAO{
    //connection to Track_Link collection
    static async injectDB(conn){
        if(trackLinks){
            return
        }
        try{
            trackLinks = await conn.db(process.env.RESTREVIEWS_NS).collection("Track_Links")
        }
        catch(e){
            console.error(`Unable to establish collection handles in trackLinkDAO: ${e}`)
        }
    }

    //get the track links visited by the user
    static async getUserLinks(userID){
        try{
            let query = ObjectID(userID)
            console.log(query)
            let cursor = await trackLinks.find({userID: query})
            const userTrackLinkList = await cursor.toArray()
            const userTotalRecords = await userTrackLinkList.length
            return { userTrackLinkList, userTotalRecords}
        }
        catch(e){
            console.error(`Unable to get user's Track Links: ${e}`)
            return { trackLinksList: [], userTotalRecords: 0}
        }
    }

    //get all the track links visted by all users
    static async getAllLinks(){
        try{
            let cursor
            cursor = await trackLinks.find()
            const trackLinksList = await cursor.toArray()
            const totalRecords = await trackLinks.countDocuments()
            return { trackLinksList, totalRecords }
        }
        catch(e){
            console.error(`Unable to get all track Links: ${e}`)
            return { trackLinksList: [], totalRecords: 0 }
        }
    }

    //create or update the track links visited by user
    static async createNUpdateUserIDTL(userID, trackLink, isFactCheck){
        try{
            let currentTime = new Date()//.addHours(8).toString()
            currentTime.setHours(currentTime.getHours() + 8)
            currentTime = currentTime.toString()
            const existTrackLinkUser = await trackLinks.findOne({
                userID: ObjectID(userID),
                trackLink: trackLink
            })
            if(existTrackLinkUser){
                const updateTrackLinkTime = await trackLinks.updateOne(
                    {userID: ObjectID(userID), trackLink: trackLink},
                    {$set: {date: currentTime}}
                )
                return true
            }
            else{
                const createTrackLinkTime = await trackLinks.insertOne({
                    userID: ObjectID(userID),
                    trackLink: trackLink,
                    isFactCheck: isFactCheck,
                    date: currentTime
                })
                return true
            }
        }
        catch(e){
            console.error(`Unable to create or update track Links: ${e}`)
            return false
        }
    }
}