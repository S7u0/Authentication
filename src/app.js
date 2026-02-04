const express = require("express");
const userRoutes = require("./routes/userRoutes");
const handleError  = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/", userRoutes);


app.use(handleError);

module.exports = app;