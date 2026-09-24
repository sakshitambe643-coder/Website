var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
var  path=require('path');
var session=require('express-session');
const fileUpload=require('express-fileupload');

var conn=mysql.createConnection({
    host:'bwpgvegynxynugdmkhi5-mysql.services.clever-cloud.com',
    user:'uhpw8jark84csxpu',
    password:'lmELqdMiV1s7tUjFr9C1',
    database:'bwpgvegynxynugdmkhi5'
});

var exe=util.promisify(conn.query).bind(conn);

router.use(express.urlencoded({extended:true}));
router.use(session({
    secret:'A2ZITHUB',
    resave:false,
    saveUninitialized:true
}))
router.use(fileUpload());

function logincheck(req,res,next){
    if(req.session.id){
next();
    }else{
        res.redirect('/admin');
    }
}

router.use(express.static('public'));


router.get('/',(req,res)=>{
// res.send(req.session);
    res.render('admin/login.ejs');
})
router.post('/login_check',async(req,res)=>{
    // res.send(req.body);
    var {username,password}=req.body;
   // res.send(username);
   var sql='select * from login where username=? and password=?';
   var data=await exe(sql,[username,password]);
  // res.send(data);
   if(data[0]){
    req.session.id=data[0].lid;
    req.session.name=data[0].name;
   res.redirect('/admin/dashboard');
   }else{
    res.redirect('/admin/');
   }
   // res.redirect('/admin/dashboard');
})
router.get('/dashboard',(req,res)=>{
    // res.send(req.session.name);
     var name=req.session.name;
     res.render('admin/dashboard.ejs',{name:name});
})
router.get('/form',(req,res)=>{
    // res.send('dashboard');
     res.render('admin/form.ejs');
})
router.get('/table',(req,res)=>{
    // res.send('dashboard');
     res.render('admin/table.ejs');
})
router.get('/logout',(req,res)=>{

    req.session.destroy();
    res.redirect('/admin');
})
router.get('/service_add',(req,res)=>{
         res.render('admin/service_add.ejs');

})
router.post('/service_save',async(req,res)=>{
    //res.send(req.body);
    var {s_icons,s_title,s_desc}=req.body;
    var sql='insert into service(s_icons,s_title,s_desc)values(?,?,?)';
    var data=await exe(sql,[s_icons,s_title,s_desc]);
    //res.send('done');
    res.redirect('/admin/service_add');
})
router.get('/service_list',async(req,res)=>{
             var sql='select * from service';
             var data=await exe(sql);
            // res.send(data);
         res.render('admin/service_list.ejs',{service:data});
})
// router.get('/service_delete/:id',async(req,res)=>{
//      // res.send('delete');
//  var id=req.params.id;
//     //res.send(id);
//    var sql=`delete from service where sid=${id}`;
//    await exe(sql);
//         res.redirect('/admin/service_list');
//     })
    router.get('/work_add',(req,res)=>{
        res.render('admin/work_add.ejs');
    })
router.post('/work_save',async(req,res)=>{
      //  res.send(req.body);
       //res.send(req.files);
               var {w_title,w_desc}=req.body;
               var img=req.files.work_img;
               var imgname=img.name;
               var newname=Date.now()+imgname;
               var imgpath=path.join(__dirname,'../','public/image',newname);
               img.mv(imgpath,(err)=>{ })
               var sql='insert into work(w_img,w_title,w_desc)values(?,?,?)';
               var data=await exe(sql,[newname,w_title,w_desc]);
              // res.send(imgpath);
              res.redirect('/admin/work_add');
    })
   router.get('/work_list',async(req,res)=>{
    var sql='select * from work';
    var data=await exe(sql);
    res.render('admin/work_list.ejs',{data:data});
   }) 
 router.get('/education_add',(req,res)=>{
    res.render('admin/education_add.ejs');
 })  
 router.post('/education_save',async(req,res)=>{
    //res.send(req.body);
    var {e_year,e_degree,e_university,e_desc}=req.body;
    var sql='insert into education(e_year,e_degree,e_university,e_desc)values(?,?,?,?)';
    var data=await exe(sql,[e_year,e_degree,e_university,e_desc]);
    //res.send('done');
    res.redirect('/admin/education_add');
})
router.get('/education_list',async(req,res)=>{
             var sql='select * from education';
             var education=await exe(sql);
            // res.send(data);
         res.render('admin/education_list.ejs',{education:education});
})

// router.get('/delete/:id',async(req,res)=>{
//      // res.send('delete');
//  var id=req.params.id;
//     //res.send(id);
//    var sql=`delete from education where eid=${id}`;
//    await exe(sql);
//         res.redirect('/admin/education_list');
//     })

router.get('/experience_add',(req,res)=>{
    res.render('admin/experience_add.ejs');
})
router.post('/experience_save',async(req,res)=>{
   // res.send(req.body);
   var {e_year,e_position,e_company,e_desc}=req.body;
   var sql='insert into experience(e_year,e_position,e_company,e_desc)values(?,?,?,?)';
   var data=await exe(sql,[e_year,e_position,e_company,e_desc]);
   //res.send('done');
   res.redirect('/admin/experience_add');
})
router.get('/experience_list',async(req,res)=>{
    //res.send('done');
var sql='select * from experience';
var experience=await exe(sql);
    //res.send(data);
    res.render('admin/experience_list.ejs',{experience:experience});
})
router.get('/skill_add',(req,res)=>{
  res.render('admin/skill_add.ejs');
})
router.post('/skill_save',async(req,res)=>{
    var {s_tech,s_per}=req.body;
    var sql='insert into skill(s_tech,s_per)values(?,?)';
var data=await exe(sql,[s_tech,s_per]);
//res.send('done');
res.redirect('/admin/skill_add');
})
router.get('/skill_list',async(req,res)=>{
 // res.send('data');
  var sql='select * from skill';
  var skill=await exe(sql);
   //res.send(data);
   res.render('admin/skill_list.ejs',{skill:skill});
})
router.get('/client_add',(req,res)=>{
       res.render('admin/client_add.ejs');
})
router.post('/client_save',async(req,res)=>{
    //res.send(req.body);
    var {c_msg,c_name,c_position}=req.body;
    var img=req.files.c_photo;
    var imgname=img.name;
    var newname=Date.now()+imgname;
    var imgpath=path.join(__dirname,'../','public/image',newname);
    img.mv(imgpath,(err)=>{ })
    var sql='insert into client(c_msg,c_photo,c_name,c_position)values(?,?,?,?)';
    var data=await exe(sql,[c_msg,newname,c_name,c_position]);
    res.redirect('/admin/client_list');
})
router.get('/client_list',async(req,res)=>{
    var sql='select * from client';
    var data=await exe(sql);
    res.render('admin/client_list.ejs',{client:data});
})
router.get('/client_delete/:id',async(req,res)=>{
     // res.send('delete');
 var id=req.params.id;
    //res.send(id);
   var sql='delete from client where cid=?';
   await exe(sql,[id]);
        res.redirect('/admin/client_list');
    })
router.get('/home_update',async(req,res)=>{
    var sql='select * from home where hid=1';
    data=await exe(sql);
   // res.send(data[0]);
    res.render('admin/home_update.ejs',{data:data[0]});
})
router.post('/home_update_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var oldimg=req.params.img;
    var {h_title1,h_title2,h_title3,h_desc}=req.body;
   // res.send(req.body);
   //res.send(req.files);
   if(req.files){
    //new
     var img=req.files.h_img;
     var imgname=req.files.h_img.name;
     var myphoto=Date.now()+imgname;
    var imgpath=path.join(__dirname,'../','public/image',myphoto);
     img.mv(imgpath,(err)=>{ })
// remove
   }else{
    var myphoto=oldimg;
   }
   var sql='update home set h_img=?,h_title1=?,h_title2=?,h_title3=?,h_desc=? where hid=?';
  var data=await exe(sql,[myphoto,h_title1,h_title2,h_title3,h_desc,id]);
  res.redirect('/admin/home_update');
})

router.get('/about_update',async(req,res)=>{
    var sql='select * from about where aid=1';
    data=await exe(sql);
   // res.send(data[0]);
    res.render('admin/about_update.ejs',{data:data[0]});
})
router.post('/about_update_save/:id',async(req,res)=>{
    var id=req.params.id;
    var {a_title,a_desc,a_name,a_email,a_age,a_address,a_title1,a_title2,a_title3,a_title4}=req.body;
    //res.send(req.body);

     var sql='update about set a_title=?,a_desc=?,a_name=?,a_email=?,a_age=?,a_address=?,a_title1=?,a_title2=?,a_title3=?,a_title4=? where aid=?';
  var data=await exe(sql,[a_title,a_desc,a_name,a_email,a_age,a_address,a_title1,a_title2,a_title3,a_title4,id]);
  res.redirect('/admin/about_update');
})

router.get('/contact_pending',async(req,res)=>{
    var sql='select * from contact_data where status=?';
     data=await exe(sql,['pending']);
     res.render('admin/contact_pending.ejs',{data:data});
})
router.get('/contact_pending_confirm/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update contact_data set status=? where cid=?';
    data=await exe(sql,['confirm',id]);
    res.redirect('/admin/contact_pending');
})
router.get('/contact_pending_reject/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update contact_data set status=? where cid=?';
    data=await exe(sql,['reject',id]);
    res.redirect('/admin/contact_pending');
})
router.get('/contact_complete',async(req,res)=>{
    var sql='select * from contact_data where status=?';
     data=await exe(sql,['confirm']);
     res.render('admin/contact_complete.ejs',{data:data});
})
router.get('/contact_reject',async(req,res)=>{
   var sql='select * from contact_data where status=?';
   data=await exe(sql,['reject']);
   res.render('admin/contact_reject.ejs',{data:data});
})

module.exports=router;
