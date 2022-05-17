const urlModel = require("../modules/urlModel")
const { isValidRequestBody, isValid } = require("../utility/validation")
const validUrl = require('valid-url')
const shortid = require('shortid')

const baseUrl='http://localhost:3000'

const createUrl = async (req, res) => {
    try {

        let body = req.body  
        if(!isValidRequestBody(body)){
        return res.status(400).send({status:false,message:"Please provide details"})
    } 

        const {longUrl} = body;

        if(!isValid(longUrl)) return res.status(400).send({status : false, msg : "Please provide a url"})

        longUrl.toLowerCase()
        if(!validUrl.isUri(longUrl)){
            return res.status(400).send({status:false,message:"Invalid longUrl"})
        }
        let url = await urlModel.findOne({longUrl:longUrl})

        if(url){
            return res.status(400).send({status:false,message:"Url already registered"})
        }

        if(!validUrl.isUri(baseUrl)){
            return res.status(400).send({status:false,message:"base url is not valid"})
        }
        const urlCode = shortid.generate()
        urlCode.toLowerCase()
        
        const checkUrlCode = await urlModel.findOne({urlCode : urlCode})
        if(checkUrlCode){
            return res.status(400).send({status:false,message:"urlCode already registered"})
        }
        
        const shortUrl = baseUrl+'/'+urlCode

        const checkShortUrl = await urlModel.findOne({ shortUrl : shortUrl })
        if(checkShortUrl){
            return res.status(400).send({status:false,message:"Short Url is already registered"})
        }

        body.shortUrl=shortUrl
        body.urlCode=urlCode
        let data=await urlModel.create(body)
        return res.status(201).send({status:true,message:"created Successfully",data:data})

    }
    catch (error) {
        res.status(500).send( { status : false, msg : error.message } )
    }
}





module.exports.createUrl = createUrl