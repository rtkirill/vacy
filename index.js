const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bot = require('./bot');
const config = require('./config');

const app = express();
const dbURL = `mongodb+srv://${config.mongoUser}:${config.mongoPwd}@vacybot-jlx8w.mongodb.net/vacy_db?retryWrites=true&w=majority`;


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(dbURL, {useNewUrlParser: true});
mongoose.connection
	.once('open', () => {
		console.log(`Mongoose - successful connection ...`);
		app.listen(process.env.PORT || config.PORT,
			() => console.log(`Server start on port ${config.PORT} ...`))
	})
	.on('error', error => console.warn(error));


setInterval(() => {
	bot.getFeed(config.MOIKRUG_URL);
}, config.REQUEST_PERIOD_TIME);