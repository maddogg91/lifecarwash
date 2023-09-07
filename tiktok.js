const express = require('express');
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cookieParser = require('cookie-parser');
const cors = require('cors');



const CLIENT_KEY = 'your_client_key' // this value can be found in app's developer portal

function auth() {
 
}

module.exports = { auth };