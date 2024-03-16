const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const mongoose = require('mongoose');
const routes = require('./routes/routes.config')
const { initInsertQuestions } = require('./models/Question')
const { initInsertActions } = require('./models/Action')
const { initInsertAdmin } = require('./models/User')
const cors = require('cors')
const env = require('./env.js')
const compression = require('compression')
const fs = require("fs")
const https = require("https")
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

let dbURI = env.dbURI;

app.use(compression());

if(env.environment == "prod") {
  app.use(cors({
    origin: ['https://inharmonyapp.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
} else {
  app.use(cors({
    origin: ['http://localhost:4200', 'https://localhost:4200', 'https://localhost', 'http://frontend', 'http://frontend:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
}

app.use(helmet());
//app.use(helmet.frameguard({ action: 'deny' }));
//app.use(helmet.xssFilter());
//app.use(helmet.noSniff());

app.use(bodyParser.json({ limit: '1mb' }));

console.log(dbURI);
mongoose
    .connect(dbURI)
    .then((result) => { 
        initInsertQuestions();
        initInsertActions();
        initInsertAdmin();
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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'up' });
});

app.use((request, response) => {
    response.status(404).render('index');
});

// Export the server object
module.exports = app;