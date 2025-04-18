const express		= require('express');
const cors  		= require('cors');
const cookieParser	= require('cookie-parser');
const mongoose		= require('mongoose');
const bodyParser	= require('body-parser').urlencoded({ extended: true });
const db		    = require('./config/db');

const port = process.argv[3] || 8000;
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
console.log(allowedOrigins);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.ENV === 'dev') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // To allow sending cookies with CORS requests
};

app.use(cors(corsOptions));
app.use(bodyParser);
app.use(cookieParser());

var database = mongoose.createConnection(db.url);

require('./app/routes')(app, database);

app.listen(port, () => {
	console.log('Listening on ' + port);
});