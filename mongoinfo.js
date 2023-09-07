const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const user= process.env['user'];
const pass= process.env['pass'];
const url= 'mongodb+srv://'+user+':'+pass+'@cluster0.4grai.mongodb.net/';
const client = new MongoClient(url);



client.connect();
const database= client.db("mdgportal");
const users= database.collection("users");

function enc(txt){

return  CryptoJS.AES.encrypt(txt, 'mdg').toString();
}

function dec(data){
  const bytes = CryptoJS.AES.decrypt(data, 'mdg');
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

async function register(email,pass, name, country, bday){
	const new_user= {
		email: email,
		passw: enc(pass),
    name: name,
    country: country,
    bday: bday,
		joindate: new Date().toLocaleString()
	}
	const user= await users.findOne({email: new_user.email});
	console.log(user);
	if(!user){
		users.insertOne(new_user);
		return true;
	}
	else{
		console.log("Username exists");
		return false;
	}
}

async function login(email,pass){
	const user= await users.findOne({email: email});
	if(user!= null){
		if(dec(user.passw) === pass){
  
		return user;
		}
		else{
			return null;
		}
	}
	else{
		return null;
	}
}

module.exports = { register, login};