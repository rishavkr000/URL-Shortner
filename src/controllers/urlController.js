const url = require("../modules/urlSchema")
const { isValidRequestBody } = require("../utility/validation")
const validUrl = require('valid-url')

const createUrl = async (req, res) => {
    try {
        const originalUrl = req.body;
        if(!isValidRequestBody(longUrl)) return res.status(400).send({ status: false, message: "URL is required" })

        if(!validUrl) return res.status(400).send({status : false, msg : "Entered URL is not valid"})
    }
    catch (error) {
        res.status(500).send( { status : false, msg : error.message } )
    }
}