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
