const express = require('express');
const router = express.Router();
const app = express();
app.use(express.static('views'));
const path = require('path');
const apiRoutes = require("./api");

router.get("/api/*", function (req, res, next){
  next("route");
});

router.use("/api", apiRoutes());

router.get('/', function(req, res, next) {
  res.redirect('/index');
});

router.get('/test', (req, res) => {
  res.send('Hello World');
})

router.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/auth/login.html'));
})

router.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/auth/join.html'));
})

module.exports = router;
