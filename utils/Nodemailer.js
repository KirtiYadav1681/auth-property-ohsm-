const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: "codedeveloper1620@gmail.com",
        pass: "lyyjblrvfmhahzxc"
    }
});

// Verify the transporter configuration
transporter.verify((error, success) => {
    if (error) {
      console.error('Error verifying transporter:', error);
    } else {
      console.log('Transporter is ready to send emails');
    }
  });
  
  module.exports = transporter;