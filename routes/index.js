const express = require('express');
const router = express.Router();
const app = express();
app.use(express.static('views'));
const path = require('path');
const apiRoutes = require("./api");
const api = require('../controllers')

router.get("/api/*", function (req, res, next){
  next("route");
});

router.use("/api", apiRoutes());

router.get('/', function(req, res, next) {
  res.redirect('/index');
});

// router.get('/test', (req, res) => {
//   res.render('index',{name : '홍길동'})
// })

router.get('/index',
  api.user.authCheck,
  (req, res) => {
    res.render('index.ejs', {data: {userdata: req.cookies.userdata}});
})

router.get('/product',
  api.user.authCheck,
  api.item.getItemList
)

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/auth/login.html'));
})

router.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/auth/join.html'));
})

router.get('/logout', (req, res, next) => {
  res.clearCookie('userdata').redirect('/login')
})

module.exports = router;
