import express from "express"
import cors from "cors"
import news from "./api/Route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/news", news) //url to use by people
app.use("*", (req, res) => res.status(404).json({error: "not found"}))
// if people go to a url that does not exist, return 404

export default app
