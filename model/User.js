const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        // required: true (since google authentication won't have password)
    },
    receiveEmails: {
        type:Boolean,
        default: false
    },
    agreeToTerms:{
        type:Boolean,
        default:true
    },
    resetToken:String,
    resetTokenExpiry:Date
});

module.exports = mongoose.model('User', userSchema);