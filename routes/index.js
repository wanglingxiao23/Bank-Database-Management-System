var express = require('express');
var router = express.Router();
var conn = require('db');

/* GET home page. */

router.get('/',function(req,res){
        res.render('login');
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
            //console.log(results);
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
        //console.log(results);
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else {
            var limit = results[0].limits;
            if(limit == 0){
                res.send(200,{data:2});
            }else if(limit == 1){
                var userid = results[0].userid;
                req.session.userid = userid;
                res.send(200,{data:0});
            }else if(limit == 2){
                res.send(200,{data:3});
            }
        }
    });
});
//注销登录
router.get('/userlogout',function(req,res){
    req.session.userid = '';
    res.redirect('/login');
});
//注销登录
router.get('/adminlogout',function(req,res){
    req.session.adminid = '';
    res.redirect('/login');
});
/* GET userindex page. */
router.get('/userindex',checkUserLogin);
router.get('/userindex',function(req,res){
    var userid = req.session.userid;
    var user = {};
    var notes = [];
    user.userid = userid;
    conn.query('select * from user_info where userid="'+userid+'"',function(error,results1){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        }else{
            user.name = results1[0].user_name;
            conn.query('select * from property where userid="'+userid+'"',function(error,results2){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                }else{
                    user.property = results2[0].sum;
                    conn.query('select * from history where userid="'+userid+'"',function(error,results3){
                        if(error){
                            console.log(error.message);
                            res.redirect('/404');
                        }else{
                            //console.log(results3);
                            results3.forEach(function(results){
                                var note = {};
                                note.date = results.date;
                                note.status = results.status;
                                note.amount = results.amount;
                                notes.push(note);
                            });
                            //console.log(user);
                            //console.log(notes);
                            res.render('userIndex',{user:user,notes:notes});
                        }
                    });
                }
            });
        }
    });
});
//检测支付密码
router.post('/user/checkPaypsd',function(req,res){
    var paypsd = req.body.paypsd;
    var userid = req.body.userid;
    conn.query('select * from user_info where userid="'+userid+'"and paypsd="'+ paypsd +'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        } else if (results == '' || results == null) {
            res.send(200,{data:1});
        } else{
            res.send(200,{data:0});
        }
    });
});
//用户取款操作
router.post('/user/withdraw',function(req,res){
    var userid = req.body.userid;
    var amount = req.body.amount;
    conn.query('update property set sum=sum-'+amount+' where userid="'+userid+'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        } else {
            conn.query('select * from property where userid="'+userid+'"',function(error,results){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                } else {
                    var sum = results[0].sum;
                    res.send(200,{data:0,sum:sum});
                }
            });
        }
    });
});
//用户存款操作
router.post('/user/recharge',function(req,res){
    var userid = req.body.userid;
    var amount = req.body.amount;
    conn.query('update property set sum=sum+'+amount+' where userid="'+userid+'"',function(error,results){
        if(error){
            console.log(error.message);
            res.redirect('/404');
        } else {
            conn.query('select * from property where userid="'+userid+'"',function(error,results){
                if(error){
                    console.log(error.message);
                    res.redirect('/404');
                } else {
                    var sum = results[0].sum;
                    res.send(200,{data:0,sum:sum});
                }
            });
        }
    });
});
/* GET adminindex page. */
//管理员主页
router.get('/adminindex/:status',checkAdminLogin);
router.get('/adminindex/:status',function(req,res){
    var status = req.params.status;
    //console.log(req.params);
    var adminid = req.session.adminid;
    var admin = {};
    admin.prenum = 0;
    admin.afternum = 0;
    var accounts = [];
    var preaccounts = [];
    var afteraccounts = [];
    conn.query('select * from admin_info where adminid="'+ adminid +'"',function(error,results1) {
        if (error) {
            console.log(error.message);
            res.redirect('/404');
        } else {
            //console.log(results1);
            admin.name = results1[0].admin_name;
            conn.query('select * from user,user_info where user.userid=user_info.userid;', function (error, results) {
                if (error) {
                    console.log(error.message);
                    res.redirect('/404');
                } else {
                    //console.log(results);
                    admin.allcredit = results.length;
                    for(var i=0;i<results.length;i++){
                        var account = {};
                        account.id = results[i].userid;
                        account.username = results[i].username;
                        account.creditnum = results[i].creditnum;
                        account.limit = results[i].limits;
                        var time = results[i].time;
                        account.time = getTime(time);
                        account.hour = getHour(time);
                        account.name = results[i].user_name;
                        account.tel = results[i].user_tel;
                        account.ID_no = results[i].ID_no;
                        account.sex = results[i].sex;
                        account.addr = results[i].addr;
                        //console.log(account);
                        if (account.limit == 0) {
                            admin.prenum++;
                            preaccounts.push(account);
                        } else {
                            admin.afternum++;
                            afteraccounts.push(account);
                        }
                        accounts.push(account);
                        //console.log(accounts);
                    };
                    //console.log(accounts);
                    //console.log(preaccounts);
                    //console.log(afteraccounts);
                    if(status == 0){
                        res.render('adminIndex', {admin: admin, accounts: accounts});
                    }else if(status == 1){
                        res.render('adminIndex', {admin: admin, accounts: preaccounts});
                    }else if(status == 2){
                        res.render('adminIndex', {admin: admin, accounts: afteraccounts});
                    }
                }
            });
        }
    });
});
//管理员审核操作
router.post('/adminindex',function(req,res){
    var userid = req.body.userid;
    var state  = req.body.state;
    if(state == 0){
        conn.query('update user set limits=1 where userid="'+userid+'"',function(error,results){
            if(error){
                console.log(error.message);
                res.redirect('/404');
            }else {
                res.send(200,{data:0});
            }
        });
    }else if(state == 1){
        conn.query('update user set limits=2 where userid="'+userid+'"',function(error,results){
            if(error){
                console.log(error.message);
                res.redirect('/404');
            }else {
                res.send(200,{data:0});
            }
        });
    }else if(state == 2){
        conn.query('delete from user where userid="'+userid+'"',function(error,results){
            if(error){
                console.log(error.message);
                res.redirect('/404');
            }else {
                res.send(200,{data:0});
            }
        });
    }
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
    }else{
        next();
    }
}
function checkAdminLogin(req, res,next) {
    console.log(req.session);
    if (!req.session.adminid) {
        res.redirect('/login');
    }else{
        next();
    }
}
function getTime(date){
    var time = date.split(' ');
    var dayTime = time[0];
    return dayTime;
}
function getHour(date){
    var time = date.split(' ');
    var dayTime = time[1];
    return dayTime;
}

module.exports = router;
