const Message = require('../models/Message')
const nodemailer = require('nodemailer');
const HttpError = require("../models/http-error");



const SaveMessage = async (req,res,next) =>{

    if(!req.body){
        return next(
            new HttpError("Invalid Message", 422)
          );
    }
    console.log(req.body)
    const {name,email,subject,message} = req.body

    const newMessage = new Message({
        name,
        email,
        subject,
        message
    })

    try {
      const createdNessage = await newMessage.save()
        
    } catch (err) {
        const error = new HttpError("Message Save failed", 500);
        return next(error);
    }
    return res.status(200).json({message:"message Saved Successfully"})

}


const getAllMessages = async(req,res,next) =>{

    try {
        const messages = await Message.find({})

        return res.status(200).json({messages})
    } catch (err) {
        const error = new HttpError("failed", 500);
        return next(error);
    }
}


const getMessageById = async(req,res,next) =>{

    const{id} = req.body

    try {
        const data = await Message.findById(id)
        return res.status(200).json(data)       
    } catch (error) {
        return res.status(400).json({Error:"Error Occured"})
    }
}

const SentMessage = async(req,res,next) =>{
    const {email,id,message} = req.body

    try {
        const respon = await User.findOneAndRemove({_id:id}) 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'icafsliit2021@gmail.com',
              pass: '#icaf225'
            }
          });
          
          var mailOptions = {
            from: 'icafsliit2021@gmail.com',
            to: `${email}`,
            subject: 'ICFF Organize Commity',
            text: `${message}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.status(200).json({message:"Successfully sent message"})
            }
          });
            
    } catch (error) {
        
        return res.status(400).json({error})
    }
}

const DeleteMessage = async(req,res,next) =>{

    const {id} = req.body

    try {
        const response = await Message.findOneAndRemove({_id:id})
        return res.status(200).json({response})
      } catch (err) {
        const error = new HttpError("Unexpected Error Occured", 503);
        return next(error);
      }
}


module.exports = {
    SaveMessage,
    getAllMessages,
    getMessageById,
    SentMessage,
    DeleteMessage
}