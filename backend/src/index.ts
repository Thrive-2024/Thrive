import cors from 'cors';
import express from 'express';
import { services } from './services';
require('dotenv').config({ path: '.env.local' }); // To get .env variable

const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser')
//to access the variable in .env file as : process.env.{variableName}
const app = express();

// Middlewares
app.use(express.json());
// To get formdata from Http Call
app.use(fileupload());
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));
app.use(cors());

// Mount REST on /api
app.use('/api', services);

//To access the image by using http://localhost:8000/images/{fileName}
app.use("/images", express.static('images'));

const port = 8000;

//connect to mongoDB
mongoose.connect(
	process.env.MONGODB_URI
).then(() => {
	app.listen(port, () => {
		console.log(`Express app listening on localhost:${port}`)
		console.log("DB connected and server is running.");
	});
}).catch((err: any) => {
	console.log("Make sure you have created .env.local file with MONGODB_URI=<conntection URL>");
	console.log(err);
});