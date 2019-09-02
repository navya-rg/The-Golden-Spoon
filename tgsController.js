module.exports.subscribe = function(receiver){
	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
  		service: 'gmail',
  		auth: {
    		user: 'thegoldenspoon.tgs@gmail.com',
    		pass: 'dholakpur123'
  		}
	});

	var mailOptions = {
  		from: 'thegoldenspoon.tgs@gmail.com',
  		to: receiver,
  		subject: 'Newsletter subscription',
  		//text: 'Thank you for subscribing to our weekly newsletter!'
  		html: '<h3 style="font-family: verdana; text-align: center;">Thank you for subscribing to our weekly newsletter!</h3>'
	};

	transporter.sendMail(mailOptions, function(error, info){
  		if (error) {
    		console.log(error);
  		} else {
    		console.log('Email sent: ' + info.response);
  		}
	});
	console.log('Email sent to: '+receiver);
};
