import * as express from 'express';
let app = express();
import * as  mongoose from 'mongoose';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

let databaseConfig = require('./config/database');
let router = require('./app/routes');

mongoose.connect(databaseConfig.url);

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());

router(app);
