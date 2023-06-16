function timer(req, res) {
    if(req.session.loggedin == true){
        res.render('plantillas/timer', req.session);
    }
    else{
        res.render('plantillas/login');
    }
}

function estadisticas(req,res){
    if(req.session.loggedin == true){
        res.render('plantillas/estadisticas', req.session);
    }
    else{
        res.render('plantillas/login');
    }
}

module.exports = {
    timer,
    estadisticas
}