import e from "cors"

let news

export default class NewsDAO{
    static async injectDB(conn){
        if(news){
            return
        }
        try {
            news = await conn.db(process.env.RESTREVIEWS_NS).collection("News")
        }
        catch (e){
            console.error(
                `Unable to establish a collection in NewsDAO: ${e}`,
            )
        }
    }

    static async getNews({
        filters = null,
        /* page = 0,
        restaurantsPerPage = 20, */
    } = {}){
        let query
        if(filters){
            if("index" in filters){
                query = {"index": { $eq: filters["index"]}}
            } 
        }

        let cursor 

        try{
            cursor = await news.find(query)
        } catch(e){
            console.error(`unable to issue command, ${e}`)
            return { newsList: [], totalNumNews: 0 }
        }

        //const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const newsList = await cursor.toArray()
            //const restaurantsList = await displayCursor.toArray()
            const totalNumNews = await news.countDocuments(query)

            return { newsList, totalNumNews }
        }catch(e){
            console.error(
                `unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { newsList: [], totalNumNews: 0}
        }
    }

    static async getTotalCountNews(difficulty){
        try{    
            const totalNumNews = await news.countDocuments({difficulty: difficulty})
            // const idx = (Math.floor(Math.random() * totalNumNews)) + 1
            // const specificNews = await news.findOne({
            //     difficulty: difficulty,
            //     index: idx
            // })
            if(totalNumNews){
                return {
                    status: "Success",
                    newsTotalCount: totalNumNews
                }
            }
            else{
                return{
                    status: "Failed",
                    message: "News does not exist!"
                }
            }
        }
        catch(e){
            console.error(`Unable to connect to news database ${e}`)
            return {
                status: "Failed",
                message: e.message
            }
        }
    }

    static async getSpecificNews(difficulty, index){
        try{
            const idx = parseInt(index)
            const specificNews = await news.findOne({
                difficulty: difficulty,
                index: idx
            })
            if(specificNews){
                return {
                    status: "Success",
                    news: specificNews
                }
            }
            else{
                return{
                    status: "Failed",
                    message: "News does not exist!"
                }
            }
        }
        catch(e){
            console.error(`Unable to connect to news database ${e}`)
            return {
                status: "Failed",
                message: e.message
            }
        }

    }
}





