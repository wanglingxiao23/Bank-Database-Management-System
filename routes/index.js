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
            var limit = results[0].limit;
            if(limit == 0){
                res.send(200,{data:2});
            }else{
                var userid = results[0].userid;
                req.session.userid = userid;
                res.send(200,{data:0});
            }

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
    admin.prenum == 0;
    admin.afternum == 0;
    var accounts = [];
    var account = {};
    conn.query('select * from admin_info where adminid="'+ adminid +'"',function(error,results) {
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else {
            admin.name = results[0].admin_name;
            conn.query('select * from user', function (error, results) {
                if (error) {
                    console.log(error.message);
                    res.redirect('/404');
                } else {
                    admin.allcredit = results.length;
                    for (var i = 0; i < results.length; i++) {
                        account.id = results[i].userid;
                        account.username = results[i].username;
                        account.creditnum = results[i].creditnum;
                        account.limit = results[i].limit;
                        var time = results[i].time;
                        account.time = getTime(time);
                        account.hour = getHour(time);
                        if(account.limit == 0){
                            account.prenum++;
                        }else if(account.limit == 1){
                            account.afternum++;
                        }
                        conn.query('select * from user_info where userid="' + account.id + '"', function (error, results) {
                            if (error) {
                                console.log(error.message);
                                res.redirect('/404');
                            } else {
                                account.name = results[0].user_name;
                                account.tel = results[0].user_tel;
                                account.ID_no = results[0].ID_no;
                                account.sex = results[0].sex;
                                account.addr = results[0].addr;
                            }
                        });
                        accounts.push(account);
                    }
                    res.render('adminIndex', {admin: admin, accounts: accounts});
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
    var time      = Date.now();
    conn.query('insert into user (username,userpsd,limit,creditnum,time) values("'+ username+'","'+userpsd+'",0,"'+creditnum+'","'+time+'")',function(error,results){
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
                            conn.query('insert into history values("'+ userid+'","'+0+'")',function(error,results){
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
        }
    });
    console.log(adminPsd);
});

router.post('/reg/check', function(req, res, next){
    var user = req.body;
    var userName = admin.userName;
    console.log(userName);
    conn.query('select * from user where username="'+userName+'"', function (error, results) {
        console.log(results);
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else {
            res.send(200,{data:0});
        }
    });
});


/* GET add_admin page. */
router.get('/add', function(req, res, next) {
    res.render('add_admin');
});

router.post('/add', function(req, res, next) {
    var adminName = req.body.adminName;
    var adminTel = req.body.adminTel;
    var adminPsd = req.body.adminPsd;
    conn.query('insert into admin_info (admin_name,admin_tel,admin_psd) values("'+ adminName+'","'+adminTel+'","'+adminPsd+'")',function(error,results){
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
    var adminTel = admin.adminTel;
    console.log(adminTel);
    conn.query('select * from admin_info where admin_tel="'+adminTel+'"', function (error, results) {
        console.log(results);
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else {
            res.send(200,{data:0});
        }
    });
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
function getTime(date){
    var time = "";
    var year = date.getFullYear().toString();
    var month = date.getMonth().toString();
    var day  = date.getDate().toString();
    time = year+"-"+month+"-"+day;
    return time;
}
function getHour(date){
    var time = "";
    var hour = date.getHours().toString();
    var minite = date.getMinutes().toString();
    var second  = date.getSeconds().toString();
    time = hour+":"+minite+":"+second;
    return time;
}

module.exports = router;
