// creating the server
const express=require("express")
const connectDB=require('./config/dbConnect.js');

// initializing Express server methods
const app=express();

// requiring local environment variables
require("dotenv").config();

// connexion method +creating a dynamic connexion PORT
connectDB();
const PORT=process.env.PORT;

// defining routes
app.use(express.json()) // defining json body part
app.use("/user",require("./routes/user.js"))

// setting connexion PORT + checking functioning
app.listen(PORT, (err)=>err? console.log(err) : console.log(`the server is running well on ${PORT}!`));