console.clear()
//loading all emvironment variables

require('dotenv').config({ path: "./config/config.env" });

//Importing all required modules
const express = require('express');
const ejs = require("ejs");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require('cookie-parser');

//Connecting to the database
const db = require('./config/db');

//Configuring the express server
const app = express();
const port = process.env.PORT || 4000;

// Configuring the frontend
app.set('view engine', 'ejs');

//Middlewares for the server
app.use(cors({
  origin: "*",
  credentials: true,
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());





//Importing the routes
const testRoutes = require('./routes/testingRoutes');
const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const employeeRoutes = require("./routes/employee");
const storeRoutes = require("./routes/store");

//Using routes
app.use('/api/v1', testRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', doctorRoutes);
app.use('/api/v1', appointmentRoutes);
app.use('/api/v1', employeeRoutes);
app.use('/api/v1', storeRoutes);



//listning the server 
app.listen(port, () => {
  console.log(`Server is running on  http://127.0.0.1:${port}/api/v1/test 👍`);
})