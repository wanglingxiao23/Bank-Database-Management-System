var express = require('express');
var router = express.Router();
var conn = require('db');

/* GET home page. */

router.get('/',function(req,res){
        res.render('add_admin');
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
    var user = {};
    var notes = [];
    var note = {};
    conn.query('select user_name from user_info where userid="'+userid+'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            user.name = results[0].user_name;
            conn.query('select * from property where userid="'+userid+'"',function(error,results){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                }else{
                    user.property = results[0].sum;
                    conn.query('select * from history where userid="'+userid+'"',function(error,results){
                        if(error){
                            console.log(error.message);
                            res.redirect('/404');
                        }else{
                            console.log(results);
                            for(var i=0;i<results.length;i++){
                                note.date = results[i].date;
                                note.status = results[i].status;
                                note.amount = results[i].amount;
                                notes.push(note);
                            }
                            console.log(user);
                            console.log(notes);
                            res.render('userIndex',{user:user,notes:notes});
                        }
                    });
                }
            });
        }
    });
});
router.get('/adminindex',checkUserLogin);
router.get('/adminindex',function(req,res){
    var adminid = req.session.adminid;
    var admin = {};
    var accounts = [];
    var account = {};
    conn.query('select admin_name from admin_info where adminid="'+adminid+'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            admin.name = results[0].admin_name;
            conn.query('select * from property where adminid="'+adminid+'"',function(error,results){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                }else{
                    user.property = results[0].sum;
                    conn.query('select * from history where userid="'+userid+'"',function(error,results){
                        if(error){
                            console.log(error.message);
                            res.redirect('/404');
                        }else{
                            console.log(results);
                            for(var i=0;i<results.length;i++){
                                note.date = results[i].date;
                                note.status = results[i].status;
                                note.amount = results[i].amount;
                                notes.push(note);
                            }
                            console.log(user);
                            console.log(notes);
                            res.render('userIndex',{user:user,notes:notes});
                        }
                    });
                }
            });
        }
    });
});



/* GET register page. */
router.get('/reg', function(req, res, next) {
    var cardNum = Math.floor(Math.random()*Math.pow(10,9));
    res.render('register',{cardNum:cardNum});
});

router.post('/reg', function(req, res, next) {
    var username  = req.body.username;
    var creditnum = req.body.creditnum;
    var userpsd   = req.body.adminPsd;
    var user_name = req.body.user_name;
    var ID_no     = req.body.ID_no;
    var user_tel  = req.body.user_tel;
    var sex       = req.body.sex;
    var addr      = req.body.addr;
    var paypsd    = req.body.paypsd;
    conn.query('insert into user values("'+ username+'","'+userpsd+'",0,"'+creditnum+'")',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            conn.query('select * from user where username="'+username+'"',function(error,results){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                }else{
                    var userid = results[0].userid;
                    conn.query('insert into user_info values("'+ userid+'","'+user_name+'","'+user_tel+'","'+ID_no+'","'+sex+'","'+addr+'","'+paypsd+'")',function(error,results){
                        if(error){
                            console.log(error.message);
                            res.redirect('/404');
                        }else{
                            req.session.userid = userid;
                            res.redirect('/userindex');
                        }
                    });
                }
            });
        }
    });
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
    conn.query('insert into admin_info values("'+ adminName+'","'+adminTel+'","'+adminPsd+'")',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            res.redirect('/login');
        }
    });
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
