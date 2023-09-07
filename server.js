const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var bodyParser = require('body-parser');
//const db= require('./mongoinfo.js');
const fs = require('fs');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
var rateLimit = require("express-rate-limit");
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var aiemail= process.env['aiemail'];
var aipass= process.env['aipass'];
var tiktok= require('./tiktok.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});



app.use(sessions({
    secret: "process.env['session']",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true 
}));

app.set('views', path.join(__dirname, 'templates'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(limiter);
app.use(cookieParser());



app.get('/', function(req, res) {
 
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/services', function(req, res){
  res.sendFile(path.join(__dirname, 'templates/services.html'))
});

app.get('/quote', function(req, res){
  res.sendFile(path.join(__dirname, 'templates/quote.html'))
});
app.post('/quote', async function(req, res, next){
  const body= await req.body;
  console.log(body);
  services= '';
  if(body.interior && body.exterior){
    services= 'interior detailing & exterior car washing';
  }
  else if(body.interior && !body.exterior){
    services= 'interior detailing';
  }
  else if(body.exterior && !body.interior){
    services= 'exterior car washing';
  }
  else{
    console.log("No services were selected");
  }
  if (services === ''){

  }
  else{
    console.log(aiemail);
    var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:  aiemail,
    pass: aipass
  }
});
if(body.street2== null){
  body.street2= "";
}
var mailOptions = {
  from: process.env['aiemail'],
  to: body.email,
  subject: 'Life Car Wash Quote Request- Automated Email, Do Not Reply',
  text: `Hello Life Car Wash Management, \nA quote has been requested for the following services: \n\n\nCustomer Name: ${body.firstname} ${body.lastname} \nContact Email: ${body.email}\nContact Number: ${body.phone}\nAddress: ${body.street}, ${body.street2}, ${body.city}, ${body.zip}\nServices Inquired: ${services}\n\nThis is an automated email response system generated by Maddogg Software LTD CO AI, please do not reply.` 
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
    return body;
  }
  
});

app.get('/media', function(req, res){
   
  res.sendFile(path.join(__dirname, 'templates/media.html'))
});
/**  
app.post('/register', function(req, res){
  const body= req.body;
  db.register(body.email,body.password, body.name, body.country, body.bday)
});

app.get('/login', function(req, res){
  res.sendFile(path.join(__dirname, 'templates/login.html'))
});

app.post('/login', async function(req, res, next){
  const body= req.body;
   user = await db.login(body.email,body.password)
  req.session.user= user
  if(req.session.user){
    res.redirect('/dashboard')
  }
  else{
    res.render(path.join(__dirname, 'templates/login.html'), {al: 'al'});
  }
});

app.get('/dashboard', function(req, res){
  res.render(path.join(__dirname, 'templates/home.html'), {'user': req.session.user.name})
});
*/
app.listen(port, () => {
  // Code.....
});


