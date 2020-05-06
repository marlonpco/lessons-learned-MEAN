const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const lessonsRoutes = require('./routes/lessons');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/admin-clients');
const lovRoutes = require('./routes/admin-lovs');
const projectRoutes = require('./routes/admin-projects');
const teamRoutes = require('./routes/admin-teams');

const mongooseOptions = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true};
const mongooseBase = "mongodb+srv://";

mongoose.connect(
  mongooseBase + process.env.MONGO_ATLAS_USR + process.env.MONGO_ATLAS_PWD + process.env.MONGO_ATLAS_URI,
  mongooseOptions
).then(() => {
  console.log('Connected to database!');
}).catch(() => {
  console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/lessons", lessonsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/lov", lovRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/team", teamRoutes);

module.exports = app;
