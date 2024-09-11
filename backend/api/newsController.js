import NewsDAO from "../dao/newsDAO.js"

export default class NewsController{
    static async apiGetNews(req, res, next){
        /* const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20 
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
 */
        let filters = {}

        if(req.query.index){
            filters.index = req.query.index
        }

        const { newsList, totalNumNews } = await NewsDAO.getNews({
            filters,
           /*  page,
            restaurantsPerPage, */
        })

        let response = {
            News: newsList,
            //page: page,
            filters: filters,
            //entries_per_page: restaurantsPerPage,
            total_result: totalNumNews,
        }
        res.json(response)
    }

    static async apiGetNewsTotalCount(req, res, next){
        try{            
            const difficulty = req.params.difficulty
            //const index = req.params.index
            const newsCountRes = await NewsDAO.getTotalCountNews(difficulty)
            res.json(newsCountRes)
        }
        catch(e){
            res.json({
                status: "Failed",
                message: `Unable to get news count: ${e}`
            })
        }
    }

    static async apiGetSpecificNews(req, res, next){
        try{            
            const difficulty = req.params.difficulty
            const index = req.params.index
            const newsRes = await NewsDAO.getSpecificNews(difficulty, index)
            res.json(newsRes)
        }
        catch(e){
            res.json({
                status: "Failed",
                message: `Unable to get news: ${e}`
            })
        }
    }
}