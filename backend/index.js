import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import NewsDAO from "./dao/newsDAO.js"
import UserDAO from "./dao/userDAO.js"
import ScoreDAO from "./dao/scoreDAO.js"
import TrackLinkDAO from "./dao/trackLinkDAO.js"
import TrackTimeDAO from "./dao/trackTimeDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 100, //max 100 users can log in at a time
        wtimeout: 2500, //time out is 2500 msecs
        useNewUrlParse: true,
        useUnifiedTopology: true
    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await NewsDAO.injectDB(client)
    await UserDAO.injectDB(client)
    await ScoreDAO.injectDB(client)
    await TrackLinkDAO.injectDB(client)
    await TrackTimeDAO.injectDB(client)
    //await NewsImageDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})
