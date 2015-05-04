var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});
/* GET register page. */
router.get('/reg', function(req, res, next) {
    res.render('register');
});
router.post('/reg', function(req, res, next) {
    var userName = req.body.username;
    var adminTel = req.body.adminTel;
    var adminPsd = req.body.adminPsd;
    console.log(adminPsd);
});
router.post('/reg/check', function(req, res, next){
    var user = req.body;
    //var adminT = JSON.parse(admin);
    var userName = admin.userName;
    console.log(userName);
    console.log(req.body);
    //res.writeHead(200, 'ok');
    res.send(200,{data:0});
});
/* GET add_admin page. */
router.get('/add', function(req, res, next) {
    res.render('add_admin');
});
router.post('/add', function(req, res, next) {
    var adminName = req.body.adminName;
    var adminTel = req.body.adminTel;
    var adminPsd = req.body.adminPsd;
    console.log(adminPsd);
});
router.post('/add/check', function(req, res, next){
    var admin = req.body;
    //var adminT = JSON.parse(admin);
    var adminTel = admin.adminTel;
    console.log(adminTel);
    console.log(req.body);
    //res.writeHead(200, 'ok');
    res.send(200,{data:0});
});
/* GET 404 page. */
router.get('/404', function(req, res, next) {
    res.render('404');
});

module.exports = router;
