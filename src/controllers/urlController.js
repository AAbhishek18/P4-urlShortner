const urlModel =require('../models/urlModel')
const shortUrl= require("node-url-shortener")
const validUrl =require('valid-url')
const shortid= require('shortid')
//const isValid = require('validator')



const shortenUrl = async function(req,res){
   try{ 
       let longUrl=req.Body.longUrl
    //    const baseUrl='http://localhost:3000'

    // if(!validUrl.isUri(baseUrl)){
    //     return res.status(400).send({status:false,msg:'invalid  baseUrl'})
    // 
    console.log(longUrl)
    if(Object.keys(Body).length==0){
        return res.status(400).send({status:false,message:'Url is required'})
    }

    if(!validUrl.isUri(longUrl)){
        return res.status(400).send({status:false,message:'Invalid url'})
        
    }
// validation of longurl
 longUrl=/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(Body.longUrl)
if(!longUrl){
    return res.status(400).send({status:false,message:'longUrl is not valid'})
}
   
let urlCode=shortid.generate();
let shortUrl=baseUrl+'/'+urlCode
  console.log(urlCode)
if(validUrl.isUri(longUrl)){

let urls={longUrl,shortUrl,urlCode}
let createdUrls=await urlModel.create(urls)
res.status(201).send({status:true,data:createdUrls})
      }
}
    catch(err){
        console.log(err)
        res.status(500).send({status:false,message:err.message})
}
}

const redirectUrl= async function(req,res){
    let shortUrlcode=req.params.shortUrl
}




module.exports.shortenUrl=shortenUrl
module.exports.redirectUrl=redirectUrl