const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const Template = require('../models/Template')
const nodemailer = require('nodemailer');


const AddTemplate = async(req,res,next) =>{

    const {title,content} = req.body

    const createTemplate = new Template({
        title,
        content,
        document:req.file.path
    })

    try {
        const data = createTemplate.save()
        return res.status(200).json({data:data})
    } catch (error) {
        
        return res.status(400).json({data:"Error Occured"})
    }


}

const GetAllTemplates = async(req,res,next) =>{

    try {
        const data = await Template.find({})
        return res.status(200).json({data})
    } catch (error) {
        return res.status(400).json({error})
    }
}


module.exports = {
    AddTemplate,
    GetAllTemplates
}