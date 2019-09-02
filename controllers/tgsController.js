const express = require('express');
const models = require('../models/models');
const app = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

module.exports.updateMenu = function(data, res){
  //console.log(data);
  models.Item.create(data).then(function(i){
    //console.log(i);
    res.send(i);
  });
};

module.exports.fetchMenu = function(res){
  models.Item.find({}).then(function(data){
    //return data;
    res.render('menu', {menu: data});
  });
};

module.exports.signupSubmit = function(data, res){
  models.User.findOne({email: data.email}, function (err, docs) {
    if(docs==undefined){
      if (!("newsletter" in data)){
        data.newsletter = false;
      }
      models.User.create(data).then(function(data){
      //res.send(data);
      data.newsletter=Boolean(data.newsletter);
      if(data.newsletter==true){
        models.Subscriber.create({email: data.email}).then(function(){});
        sendMail(data.email);
      }
      sendMail(data.email,"Signup Successful", "Thank you for joining our family!");
        res.render('index', {message: ''});
      });
    }
    else{
      res.send("User already exists");
    }
  });
};

module.exports.loginSubmit = function(data, res){
  models.User.findOne({email: data.username}, function (err, docs){
    if(docs==undefined){
      res.render('login', {message: '**User does not exist**'});
    }
    else if(docs.password!=data.password){
      res.render('login', {message: '**Incorrect password**'});
    }
    else if(docs.password==data.password){
      res.render('login', {message: '**Successfully logged in**'});
    }
  });
};

module.exports.forgotPasswordSubmit = function(data, res){
  models.User.findOne({email: data.username}, function (err, docs){
    if(docs==undefined){
      res.render('forgotPassword', {message: '**User does not exist**'});
    }
    else{
      sendMail(data.username,"Forgot Password", "Your password is: "+docs.password);
      res.render('forgotPassword', {message: '**Mail containing password has been sent**'});
    }
  });
};

var sendMail = function(receiver, sub='Newsletter subscription', msg="Thank you for subscribing to our weekly newsletter!"){
	models.Subscriber.findOne({email: receiver}, function(err, docs){
    if(docs==undefined){
      models.Subscriber.create({email: receiver}).then(function(){});
    }
  });
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
  		subject: sub,
  		//text: 'Thank you for subscribing to our weekly newsletter!'
  		html: '<h3 style="font-family: verdana; text-align: center;">'+msg+'</h3>'
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
module.exports.sendMail = sendMail;



