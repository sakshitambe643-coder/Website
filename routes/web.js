var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:'bwpgvegynxynugdmkhi5-mysql.services.clever-cloud.com',
    user:'uhpw8jark84csxpu',
    password:'lmELqdMiV1s7tUjFr9C1',
    database:'bwpgvegynxynugdmkhi5'
});
var exe=util.promisify(conn.query).bind(conn);
router.use(express.static('public'));
router.use(express.urlencoded({extended:true}));

router.get('/',async(req,res)=>{
    var sql='select * from home where hid=1';
    var data=await exe(sql);
    res.render('web/index.ejs',{data:data[0]});
})
router.get('/about',async(req,res)=>{
     var sql='select * from about where aid=1';
    var data=await exe(sql);
    res.render('web/about.ejs',{data:data[0]});
})
router.get('/services',async(req,res)=>{
    var sql='select * from service';
    var data=await exe(sql);
    res.render('web/services.ejs',{data:data});
})
router.get('/header',(req,res)=>{
    res.render('web/header.ejs');
})
router.get('/footer',(req,res)=>{
    res.render('web/footer.ejs');
})
router.get('/resume',async(req,res)=>{
    var sql='select * from  education';
    var education=await exe(sql);
    // res.render('web/resume.ejs',{education:education});

    var sql2='select * from experience';
    var experience=await exe(sql2);

    var sql3='select * from skill';
    var skill=await exe(sql3);
    res.render('web/resume.ejs',{education:education,experience:experience,skill:skill});
})
router.get('/clients',async(req,res)=>{
var sql='select * from client';
var data=await exe(sql);
    res.render('web/clients.ejs',{client:data});
})
router.get('/contact',(req,res)=>{
   // var sql='select * from contact_data';
   // var data=await exe(sql);
    res.render('web/contact.ejs');
})
router.get('/portfolio',async(req,res)=>{
    var sql='select * from work';
    var work=await exe(sql);
    res.render('web/portfolio.ejs',{work:work});
})
router.post('/contact_save',async(req,res)=>{
    //res.send('contact_save');
   // res.send(req.body);
    var {name,email,message}=req.body;
 var da=new Date();
 var date1=da.getDate()+"-"+ Number(da.getMonth()+1)+"-"+da.getFullYear();
 //res.send(date1)
    var sql='insert into contact_data(name,email,message,status,cdate)values(?,?,?,?,?)';
    var data=await exe(sql,[name,email,message,'pending',date1]);
    res.redirect('/contact');

    
})
module.exports=router;
