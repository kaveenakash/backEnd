const News = require('../models/News')
const nodemailer = require('nodemailer');
const HttpError = require("../models/http-error");



const SaveNews = async (req,res,next) =>{

    if(!req.body){
        return next(
            new HttpError("Invalid News", 422)
          );
    }
    console.log(req.body)
    const {news,header} = req.body

    const newNews = new News({
        news,
        header
    })

    try {
      const createdNews = await newNews.save()
        
    } catch (err) {
        const error = new HttpError("News Save failed", 500);
        return next(error);
    }
    return res.status(200).json({message:"News Saved Successfully"})

}





const GetAllNews = async(req,res,next) =>{

    try {
        const news = await News.find({})

        return res.status(200).json({news})
    } catch (err) {
        const error = new HttpError("failed", 500);
        return next(error);
    }
}




module.exports = {
    SaveNews,
    GetAllNews
}