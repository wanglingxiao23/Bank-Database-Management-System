var express = require('express');
var router = express.Router();
var conn = require('db');

/* GET home page. */

router.get('/',function(req,res){
        res.render('userIndex');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login/admin',function(req,res,next) {
    //===handle====//
    var adminTel = req.body.admintel;
    var adminPsd = req.body.adminpsd;
    console.log(req.body);
        conn.query('select * from admin_info where admin_tel="'+adminTel+'"and admin_psd="'+adminPsd+'"', function (error, results) {
            console.log(results);
            if (error) {
                console.log(error.message);
                res.redirect('/404');
            } else if (results == '' || results == null) {
                res.send(200,{data:1});
            } else {
                var adminid = results[0].adminid;
                req.session.adminid = adminid;
                console.log(session);
                res.send(200,{data:0});
            }
        });
});
router.post('/login/user',function(req,res,next) {
    var username = req.body.username;
    var userpsd = req.body.userpsd;
    console.log(req.body);
    conn.query('select * from user where username="'+username+'"and userpsd="'+userpsd+'"', function (error, results) {
        console.log(results);
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else {
            var userid = results[0].userid;
            req.session.userid = userid;
            res.send(200,{data:0});
        }
    });
});
/* GET index page. */
router.get('/userindex',checkUserLogin);
router.get('/userindex',function(req,res){
    var userid = req.session.userid;
    console.log(userid);
    var user = {};
    conn.query('select user_name from user_info where userid="'+userid+'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            user.name = results[0].user_name;
            console.log(user);
            res.render('userIndex',{user:user});
        }
    });
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

function checkUserLogin(req, res, next) {
    console.log(req.session);
    if (!req.session.userid) {
        res.redirect('/login');
    }
    next();
}
function checkAdminLogin(req, res) {
    console.log(req.session);
    if (!req.session.adminid) {
        res.redirect('/login');
    }
    next();
}

module.exports = router;
