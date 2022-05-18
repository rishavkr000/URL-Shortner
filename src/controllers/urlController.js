const urlModel = require("../modules/urlModel")
const { isValidRequestBody, isValid } = require("../utility/validation")
const validUrl = require('valid-url')
const shortid = require('shortid')

// POST /url/shorten

const createUrl = async (req, res) => {
    try {

        let body = req.body
        if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:"Please provide details"})
        } 

        const {longUrl} = body;

        if(!isValid(longUrl)) return res.status(400).send({status : false, msg : "Please provide a url"})

        if(!validUrl.isUri(longUrl)){
            return res.status(400).send({status:false,message:"Enter a valid url"})
        }
        let url = await urlModel.findOne({longUrl:longUrl})

        if(url){
            return res.status(400).send({status:false,message:"Url already registered"})
        }
        const baseUrl='http://localhost:3000'
        if(!validUrl.isUri(baseUrl)){
            return res.status(400).send({status:false,message:"base url is not valid"})
        }
        const urlCode = shortid.generate().toLowerCase()
        
        const checkUrlCode = await urlModel.findOne({urlCode : urlCode})
        if(checkUrlCode){
            return res.status(400).send({status:false,message:"urlCode already registered"})
        }
        
        const shortUrl = baseUrl+'/'+urlCode

        const checkShortUrl = await urlModel.findOne({ shortUrl : shortUrl })
        if(checkShortUrl){
            return res.status(400).send({status:false,message:"Short Url is already registered"})
        }

        let result = {
            urlCode,
            longUrl,
            shortUrl
        }

        let data = await urlModel.create(result)
        return res.status(201).send({status:true,message:"created Successfully",data:data})

    }
    catch (error) {
        res.status(500).send( { status : false, msg : error.message } )
    }
}


// GET /:urlCode
//This is 2nd API

const getUrl = async (req, res) => {
    try {
        const urlCode = req.params.urlCode

        const data = await urlModel.findOne({ urlCode : urlCode })
        if(!data) {
             return res.status(404).send({status : false, msg: "URL not found"})
        }   
        return res.status(302).redirect(data.longUrl)
    }
    catch (error) {
        res.status(500).send( { status : false, msg : error.message } )
    }
}





module.exports.createUrl = createUrl
module.exports.getUrl = getUrl
