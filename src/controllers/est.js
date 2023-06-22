
function estadisticas(req,res){
    if(req.session.loggedin == true){
        res.render('plantillas/estadisticas', req.session);
    }
    else{
        res.render('plantillas/login');
    }
}


module.exports = {
    estadisticas,
}