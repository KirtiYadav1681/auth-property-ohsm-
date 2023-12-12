const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User'); 

const transporter = require('../utils/Nodemailer');
const { generateResetToken,generateResetTokenExpiry } = require('../utils/ResetPaswsordToken');

// Registration Controller
module.exports.register = async(req,res) => {
    try {
        // Checking if the user already exists
        const userAlreadyExsists = await User.findOne({email: req.body.email});
        // if User already exists returning the message
        if(userAlreadyExsists){return res.status(409).send({message:"User already esxists."})}
        // if user does not already exists then adding the user to db
        else{
            const { fullName, email, password, confirmPassword, receiveEmails, agreeToTerms } = req.body;
            if(password !== confirmPassword) {return res.status(400).send({message:"Passwords do not match."})}
            else{
                // hashing password
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                  return res.status(500).send({ message:"Error hashing password."});
                } else {
                    // creating new user
                    const newUser = new User({fullName,email,password: hashedPassword,receiveEmails,agreeToTerms,});
                    // saving the new user to db
                    newUser.save();
                    return res.status(201).send({ message: "User Successfully Registered.Please Log in now." });
                }
                });
            }
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error in creating a new user", error})
    }  
};

// Login Controller
module.exports.login = async (req,res) => {
    try {
        // Checking if the user already exists
        const userAlreadyExists = await User.findOne({ email: req.body.email });
        // if user does not already exists then asking him to register first
        if(!userAlreadyExists) {return res.status(404).send({message:"User not found, please register first."})}
        // if User already exists then checking the password to login
        else{
            // checking password
            const passwordMatched = await bcrypt.compare(req.body.password, userAlreadyExists.password);
            // if password does not match then returning the message
            if(!passwordMatched) {return res.status(400).send({message:"Invalid login credentials."})}
            else{
                // on password matching adding the jwt token 
                const token = jwt.sign({userId:userAlreadyExists._id},process.env.JWT_SECRET,{expiresIn: '2d'});
                return res.status(200).send({message:"Logged in successfully.", token});
            }
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error in logging in a user", error})
    }
};

// Sending resetPassword link:
module.exports.sendResetPasswordLink = async (req,res) => {
    try {
        // Checking if the user exists
        const user = await User.findOne({email:req.body.email});
        // if user doesn't exists returning the message
        if(!user) { return res.status(400).send({message:"User not found."})}
        else{
            // Generating reset token and expiry
            const resetToken = generateResetToken();
            const resetTokenExpiry = generateResetTokenExpiry();
            // Saving reset token and expiry to the user
            user.resetToken = resetToken;
            user.resetTokenExpiry = resetTokenExpiry;
            await user.save();
            //Sending email with reset link
            const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
            const mailOptions= {
                from: 'myemail',
                to: user.email,
                subject: "Password Reset",
                text: `Click the following link to reset your password: ${resetLink}`,
            };
            // sending mail using the transporter
            await transporter.sendMail(mailOptions);
            return res.status(200).send({message:"Plaese check the reset link sent to your email."});
        }
    } catch (error) {
        return res.status(500).send({message:"Internal server error at sending reset password link.", error});
    }
};

// ResetPassword Controller
module.exports.resetPassword = async (req,res) => {
    try {
        // Extracting the reset token from the url
        const {token} = req.params;
        // Extracting new password and confirm new password from the request's body
        const {newPassword, confirmNewPassword} = req.body;
        // if new password and confirm new password do not match then returing the message
        if(newPassword !== confirmNewPassword) {return res.send({message:"Passwords do not match."})}
        // else finding the user based on the reset token found from the url and also verifying if the reset token is expired or not
        const user = await User.findOne({resetToken:token,resetTokenExpiry:{$gt: Date.now()}});
        // if we do not find any such user then returing the message
        if(!user) {return res.status(400).send({message:"Invalid or expired token."})}
        else{
            // hashing the new password
            bcrypt.hash(newPassword,10,async(err,hashedPassword) => {
                if(err){ return res.status(500).send({message:"Error in hashing password."})}
                else{
                    // setting the new password to the user
                    user.password = hashedPassword;
                    // removing the reset token
                    user.resetToken = undefined;
                    // removing the token expiry
                    user.resetTokenExpiry = undefined;
                    // saving the changes to the user
                    await user.save();
                    return res.send({message:"Password reset successfully."});
                }
            })
        }
    } catch (error) {
        return res.status(500).send({message:"Internal server error in resetting the password.", error});
    }
};

// Google authentication success callback
module.exports.callbackSuccess = (req, res) => {
    try {
        // Generating a new token
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
        // Sending the token and success message to the client
        return res.status(200).send({
            message: "Successfully signed in with google.",
            token
        });
    } catch (error) {
        return res.status(500).send({message:"Internal server error in google authentication success callback.", error});
    }
};
