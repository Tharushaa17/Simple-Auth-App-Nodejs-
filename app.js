const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const app = express();

// const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(express.json());
app.use("/users", router);

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, {useNewUrlPaser: true}, ()=>{
    console.log("Database Connected!");
});

app.listen(PORT, ()=>{
    console.log(`Server listing to ${PORT}`);
});