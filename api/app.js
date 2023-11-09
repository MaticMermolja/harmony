const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const mongoose = require('mongoose');
const routes = require('./routes/routes.config')
const { initInsertQuestions } = require('./models/Question')
const { initInsertActions } = require('./models/Action')
const cors = require('cors')
const env = require('./env.js')
const compression = require('compression')
const fs = require("fs")
const https = require("https")

const app = express();

// Connect to MongoDB
let dbURI;
let originCors;

if (env.environment === "docker") {
    dbURI = 'mongodb://mongo/happymedb';
    if (env.HTTPS === "true") {
        originCors = 'https://localhost'
    } else {
        originCors = 'http://localhost'
    }
} else {
    dbURI = env.dbURI;
    if (env.HTTPS === "true") {
        originCors = 'https://localhost:4200'
    } else {
        originCors = 'http://localhost:4200'
    }
}

app.use(compression());

if(env.environment == "prod") {
  app.use(cors({
    origin: ['https://inharmonyapp.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
} else {
  app.use(cors({
    origin: ['http://localhost:4200', 'https://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
}

app.disable('x-powered-by');
app.use((request, response, next) => {
    response.header('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

mongoose
    .connect(dbURI)
    .then((result) => { 
        initInsertQuestions();
        initInsertActions();
        if (env.HTTPS == "true" && env.environment != "prod") {
            https
              .createServer(
                {
                  key: fs.readFileSync("cert/server.key"),
                  cert: fs.readFileSync("cert/server.cert"),
                },
                app
              )
              .listen(3000, () => {
                console.log(
                  `Secure demo app started in '${
                    process.env.NODE_ENV || "development"
                  } mode' listening on port :3000!`
                );
              });
        } else {
            app.listen(3000, () => {
                console.log('Connected to DB.');
                console.log('Listening on port :3000.');
            });
        }
    })
    .catch((err) => { 
        console.log(err) 
    });


// View engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: env.jwt_secret,
      resave: false,
      saveUninitialized: true,
    })
  );


// Set logger
app.use(morgan('dev'));

// Register routes
app.use('/api', routes);

app.use((request, response) => {
    response.status(404).render('404');
});

// Export the server object
module.exports = app;