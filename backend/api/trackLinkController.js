import TrackLinkDAO from "../dao/trackLinkDAO.js"

export default class TrackLinkController{
    //get the links clicked by specific user
    static async apiGetUserLink(req, res, next){
        //let filters = {}
        try{
            const userID = req.params.userID
            console.log(req.params.userID)
            const { userTrackLinkList, userTotalRecords } = await TrackLinkDAO.getUserLinks(userID)

            if(userTotalRecords != 0){
                res.json({
                    status: "Success",
                    response: userTrackLinkList,
                    totalLinksVisited: userTotalRecords
                })
            }
            else{
                res.json({
                    status: "Failed",
                    response: userTrackLinkList,
                    totalLinksVisited: userTotalRecords
                })
            }
        }
        catch (e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to find the links for this user",
                error: e.message
            })
        }
    }

    //get all the data in the Track Link Collection
    static async apiGetAllUserLinks(req, res, next){
        try{
            const { trackLinksList, totalRecords } = await TrackLinkDAO.getAllLinks()
            if(totalRecords != 0){
                res.json({
                    status: "Success",
                    response: trackLinksList,
                    totalLinksVisited: totalRecords
                })
            }
            else{
                res.json({
                    status: "Failed",
                    response: trackLinksList,
                    totalLinksVisited: totalRecords
                })
            }
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to get all track links from database",
                error: e.message
            })
        }
    }

    //Create a new data for every time the user press the link
    static async apiCreateUserTrackLink(req, res, next){
        try{
            const userID = req.body.userID
            const trackLink = req.body.trackLink
            const isFactCheck = req.body.isFactCheck
            const resCreateOrUpdateTL = await TrackLinkDAO.createNUpdateUserIDTL(userID, trackLink, isFactCheck)
            if(resCreateOrUpdateTL){
                res.json({
                    status: "Success",
                    message: "Track Link created or updated"
                })
            }
            else{
                res.json({
                    status: "Failed",
                    message: "Unable to create or update track link!"
                })
            }
        }
        catch(e){
            res.status(500).json({
                status: "Failed",
                message: "Unable to create track link for user",
                error: e.message
            })
        }
    }
}