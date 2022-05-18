const urlModel = require("../modules/urlModel");
const redis = require("redis");

const {
    promisify
} = require("util");

//Connect to redis
const redisClient = redis.createClient(
    10321,
    "redis-10321.c301.ap-south-1-1.ec2.cloud.redislabs.com", {
        no_ready_check: true
    }
);
redisClient.auth("Lft6ocsuciDUvWys2q8QLmajJxhwrMgM", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);




const fetchUrl = async function (req, res) {
    let url = await GET_ASYNC(`${req.params.urlCode}`)
    if (!url) {
        let check = await urlModel.findOne({urlCode : req.params.urlCode});
        if(!check) return res.status(404).send({status:false, msg: "Url not found"})
        await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(check.longUrl))
        console.log("I am inside db call")
        return res.redirect(check.longUrl)
    }
    console.log("I am from redis")

    return res.redirect(url)

};

module.exports.fetchUrl = fetchUrl;