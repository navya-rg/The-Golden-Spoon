const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');
const models = require('../models/models');
const nodemailer = require('nodemailer');

module.exports.updateMenu = function(data, res){
  models.Item.create(data).then(function(i){
    res.send(i);
  });
};

fetchMenu = function(req, res){
  models.Item.find({}).then(function(data){
    res.render('menu', {menu: data, user: req.session.user});
  });
};
module.exports.fetchMenu = fetchMenu;

module.exports.signupSubmit = function(req, res){
  var data = req.body;
  models.User.findOne({email: data.email}, function (err, docs) {
    if(docs==undefined){
      if (!("newsletter" in data)){
        data.newsletter = false;
      }
      models.User.create(data).then(function(data){
        data.newsletter=Boolean(data.newsletter);
        if(data.newsletter==true){
          models.Subscriber.create({email: data.email}).then(function(){});
          sendMail(data.email);
        }
        sendMail(data.email,"Signup Successful", "Thank you for joining our family!");
        req.session.user = data.email;
        console.log('After signup: ', req.session);
        fetchMenu(req, res);
        //res.render('index', {message: ''});
      });
    }
    else{
      res.send("User already exists");
    }
  });
};

module.exports.loginSubmit = function(req, res){
  var data = req.body;
  models.User.findOne({email: data.username}, function (err, docs){
    if(docs==undefined){
      res.render('login', {message: '**User does not exist**'});
    }
    else if(docs.password!=data.password){
      res.render('login', {message: '**Incorrect password**'});
    }
    else if(docs.password==data.password){
      req.session.user = data.username;
      console.log('After login: ',req.session);
      fetchMenu(req, res);
      //res.render('index', {message: '', user: req.session.user});
      //res.render('login', {message: '**Successfully logged in**'});
    }
  });
};

module.exports.logout = function(req, res){
  req.session.user = undefined;
  console.log('After logout: ', req.session);
  res.render('login', {message: '**Successfully logged out**'});
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

function write(temp){
  models.Cart.create(temp);
}

function fetch(item, quantity, req, callback){
  models.Item.findOne({name: item}, function (err, docs){
    var temp = {};
    temp['quantity'] = quantity;
    temp['email'] = req.session.user;
    temp['item'] = docs.item;
    temp['name'] = docs.name;
    temp['totalprice'] = docs.price * quantity;
    callback(temp);
  });
}

function checkIfExists(temp, item, req){
  return new Promise((resolve) => {
    setTimeout(()=>{
      models.Cart.findOne({name: item}, function (err, docs){
        if(docs==undefined){
          fetch(item, temp[item], req, write);
        }
        else{
          docs.quantity+=temp[item];
          docs.save();
        }
      });
      resolve(item);
    }, 1000);
  });
}

module.exports.add2cart = function(req, res){
  var data = req.body;
  var temp = {};
  for (item in data){
    data[item] = Number(data[item]);
    if(data[item]>0 && data[item]<6){
      temp[item] = data[item];
    }
  }
  let promises=[];
  for(item in temp){
    promises.push(checkIfExists(temp, item, req));
  }
  Promise.all(promises).then((results) => {
    models.Item.find({}).then(function(data){
      res.render('menu', {menu: data, user: '*'+req.session.user});
    });
    //printCart(req, res);
  }).catch((e) => {});
};

module.exports.deleteFromCart = function(req, res){
  var name = req.body.name;
  models.Cart.find({ name:name }).remove().exec().then(function(){
    printCart(req, res);
  });
};

printCart = function(req, res){
  models.Cart.find({email: req.session.user}, function(err, docs){
    /*docs = JSON.stringify(docs);
    console.log(docs);*/
    res.render('cart', {user: req.session.user, data: docs});
  });
};
module.exports.printCart = printCart;

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



