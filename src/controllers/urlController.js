const urlModel =require('../models/urlModel')
const validUrl =require('valid-url')
const shortid= require('shortid')

const redis =require('redis');
const {promisify}=require("util")



const redisClient = redis.createClient(
    14169,
    "redis-14169.c16.us-east-1-2.ec2.cloud.redislabs.com",
    
    { no_ready_check: true }
  );
  redisClient.auth("XpjNU5wqWNRfxsvtC18K9eXU43xR0FZb", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });


//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

  
const shortenUrl = async function(req,res){
   try{ 
       let longUrl=req.body.longUrl
       let data=req.body

    
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:'Url is required'})
    }

    if(!validUrl.isUri(longUrl)){
        return res.status(400).send({status:false,message:'Invalid url'})
    }
let checkUrldb=await urlModel.findOne({longUrl:longUrl}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
if(checkUrldb){
    return res.status(200).send({status:true,data:checkUrldb})
}
const baseUrl='http://localhost:3000'
let urlCode=shortid.generate().toLowerCase();
let shortUrl=baseUrl+'/'+urlCode
  
let urls={longUrl,shortUrl,urlCode}// creating Object

await urlModel.create(urls)
let createdUrl=await urlModel.findOne({urlCode:urlCode}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
await SET_ASYNC(`${req.params.urlCode}`,JSON.stringify(createdUrl))
res.status(201).send({status:true,data:createdUrl})
      }
 catch(err){
    res.status(500).send({status:false,message:err.message})}
}
//redirect url, GET API
const redirectUrl= async function(req,res){
   // let urlCode=req.params.urlCode
    let catchedUrl =await GET_ASYNC(`${req.params.urlCode}`)
    let catcheUrl=JSON.parse(catchedUrl)
    if(catcheUrl){
       return res.status(307).redirect(catcheUrl.longUrl)
    }
    else{
        let orginalUrl=await urlModel.findOne({urlCode:req.params.urlCode}).select({longUrl:1})
    await SET_ASYNC(`${req.params.urlCode}`,JSON.stringify(orginalUrl))
       // if(!orginalUrl){return res.status(400).send({status:false,message:'url not found'})}
    res.status(307).redirect({data:orginalUrl})
    }
    
   
}




module.exports.shortenUrl=shortenUrl
module.exports.redirectUrl=redirectUrl