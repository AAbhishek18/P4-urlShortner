const urlModel =require('../models/urlModel')
const shortUrl= require("node-url-shortener")
const validUrl =require('valid-url')
const shortid= require('shortid')
//const isValid = require('validator')



const shortenUrl = async function(req,res){
   try{ 
       let longUrl=req.body.longUrl
       let data=req.body

    // if(!validUrl.isUri(baseUrl)){
    //     return res.status(400).send({status:false,msg:'invalid  baseUrl'})
    // 
    //console.log(body.longUrl)
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:'Url is required'})
    }

    if(!validUrl.isUri(longUrl)){
        return res.status(400).send({status:false,message:'Invalid url'})
        
    }
// validation of longurl
//  longUrl=/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(Body.longUrl)
// if(!longUrl){
//     return res.status(400).send({status:false,message:'longUrl is not valid'})
// }
const baseUrl='http://localhost:3000'
let urlCode=shortid.generate();
let shortUrl=baseUrl+'/'+urlCode
  console.log(urlCode)


let urls={longUrl,shortUrl,urlCode}
let createdUrls=await urlModel.create(urls)
res.status(201).send({status:true,data:createdUrls})
      
}
    catch(err){
        console.log(err)
        res.status(500).send({status:false,message:err.message})
}
}
//redirect url, GET API
const redirectUrl= async function(req,res){
    let urlCode=req.params.urlCode
    let orginalUrl=await urlModel.findOne({urlCode}).select({longUrl:1})
    if(!orginalUrl){return res.status(400).send({status:false,message:'url not found'})}
    res.status(301).send({data:orginalUrl})
   
}




module.exports.shortenUrl=shortenUrl
module.exports.redirectUrl=redirectUrl