const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS
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