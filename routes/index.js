var express = require('express');
var router = express.Router();
var conn = require('db');
var mysql = require('mysql');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});


/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login/admin',function(req,res,next) {
    var adminTel = req.body.adminTel;
    var adminPsd = req.body.adminPsd;
    var conn = mysql.createConnection({
        //host: 'localhost',
        user: 'root',
        password: '123456'
        //database: 'bank_system',
        //port: 3306
    });
    if(conn.connect()) {
        conn.query('select adminid from admin_info where admin_tel=' + adminTel + 'and admin_psd=' + adminPsd, function (error, results) {
            if (error) {
                console.log(error.message);
                //req.flash('error',error.message);
                res.redirect('/404');
            } else if (results == '' || results == null) {
                //req.flash('info','用户名和密码不符合！');
                res.redirect('/login');
            } else {
                var url = '/login/admin/' + results;
                console.log(url);
                res.writeHead(200, {'Set-Cookie': 'adminid=' + results,
                    'Content-Type': 'text/plain'
                });
                res.end(url);
            }
        });
    }else{
        console.log('出粗啦');
    }
    conn.end();
})

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
