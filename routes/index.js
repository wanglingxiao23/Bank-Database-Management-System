var express = require('express');
var router = express.Router();
var conn = require('db');

//生成一个session//
var sessions = {};
var key = 'session_id';
var EXPIRES = 20 * 60 * 1000;
var generate = function(){
    var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
};
//============//
/*function (req,res){
    //====检测session===//
    var id = req.cookies[key];
    if(!id){
        req.session = generate();
    }else{
        var session = session[id];
        if(session){
            if(session.cookie.expire>(new Date()).getTime()){
                //更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            }else{
                //超时了，删除旧的数据，并重新生成
                delete sessions[id];
                req.session = generate();
            }
        }else{
            //如果session过期或口令不对，重新生成session
            req.session = generate();
        }
    }
}*/

/* GET home page. */
router.get('/',function(req,res,next){
    //====检测session===//
    var id = req.cookies[key];
    console.log(id);
    if(!id){
        req.session = generate();
    }else{
        var session = session[id];
        if(session){
            if(session.cookie.expire>(new Date()).getTime()){
                //更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            }else{
                //超时了，删除旧的数据，并重新生成
                delete sessions[id];
                req.session = generate();
            }
        }else{
            //如果session过期或口令不对，重新生成session
            req.session = generate();
        }
    }
    console.log(req.session);
    if (!req.session.adminid) {
        res.redirect('/login');
    }else{
        var adminid = req.session.adminid;
        console.log(adminid);
    }
});


/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login/admin',function(req,res,next) {
    //session检测
    var id = req.cookies[key];
    if(!id){
        req.session = generate();
    }else{
        var session = session[id];
        if(session){
            if(session.cookie.expire>(new Date()).getTime()){
                //更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            }else{
                //超时了，删除旧的数据，并重新生成
                delete sessions[id];
                req.session = generate();
            }
        }else{
            //如果session过期或口令不对，重新生成session
            req.session = generate();
        }
    };
    //===handle====//
    var adminTel = req.body.admintel;
    var adminPsd = req.body.adminpsd;
    console.log(req.body);
    conn.connect();
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
                console.log(req.session);
                //res.setHeader('Set-Cookie','"adminid"="' + adminid+'"')
                res.send(200,{data:0});
            }
        });
    conn.end();
});
router.post('/login/user',function(req,res,next) {
    var username = req.body.username;
    var userpsd = req.body.userpsd;
    console.log(req.body);
    conn.connect();
    conn.query('select * from user where username="'+username+'"and userpsd="'+userpsd+'"', function (error, results) {
        console.log(results);
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else {
            var adminid = results[0].userid;
            res.setHeader('Set-Cookie','"userid"="' + userid+'"')
            res.send(200,{data:0});
        }
    });
    conn.end();
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
