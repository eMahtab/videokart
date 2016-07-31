exports.home=function(req,res){
  res.render('index',{session:req.session});
                  }

exports.gallery=function(req,res){
              res.render('gallery',{session:req.session});
          }

exports.upload=function(req,res){
          res.render('upload',{session:req.session});
}

exports.signup=function(req,res){
 res.render('signup',{session:req.session});
}

exports.login=function(req,res){
  res.render('login',{session:req.session});
}

exports.buy=function(req,res){

  if(req.query.type != null){
    req.session.type=req.query.type;
    console.log("Type is "+req.session.type);
  }

  if(req.session.loggedIn != true){
    res.render('login',{session:req.session});
  }else{
    if(req.session.type == null){
      res.render('gallery',{session:req.session});
      return;
    }
    res.render('upload',{session:req.session});
  }

}
