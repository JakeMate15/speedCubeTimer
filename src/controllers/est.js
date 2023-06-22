
function estadisticas(req,res){
    if(req.session.loggedin == true){
        req.session.pb = req.session.bpb==2147483637? '-': formatTime(req.session.bpb);
        req.session.ao5 = req.session.bavg5==2147483637? '-': formatTime(req.session.bavg5);
        req.session.ao12 = req.session.bao12==2147483637? '-': formatTime(req.session.bao12);

        req.getConnection((err, conn) => {
            conn.query('SELECT tiempo, fecha, valido, idSesion, mezcla,promedio_tiempo  FROM tmp t CROSS JOIN (  SELECT AVG(tiempo) AS promedio_tiempo FROM tmp WHERE idSesion = ?) promedio WHERE t.idSesion = ?', [req.session.idSesion,req.session.idSesion], (err, prom) => {
                
                req.session.info = JSON.stringify(prom);
                req.session.avg = formatTime(prom[0].promedio_tiempo);
                res.render('plantillas/estadisticas', req.session);
            });
        });

        
    }
    else{
        res.render('plantillas/login');
    }
}

function acerdaDE(req,res){
    if(req.session.loggedin == true){   
        res.render('plantillas/acerca', req.session);        
    }
    else{
        res.render('plantillas/login');
    }
}

function tiempos(req,res){
    if(req.session.loggedin == true){
        req.session.pb = req.session.bpb==2147483637? '-': formatTime(req.session.bpb);
        req.session.ao5 = req.session.bavg5==2147483637? '-': formatTime(req.session.bavg5);
        req.session.ao12 = req.session.bao12==2147483637? '-': formatTime(req.session.bao12);

        req.getConnection((err, conn) => {
            conn.query('SELECT tiempo, fecha, valido, idSesion, mezcla,promedio_tiempo  FROM tmp t CROSS JOIN (  SELECT AVG(tiempo) AS promedio_tiempo FROM tmp WHERE idSesion = ?) promedio WHERE t.idSesion = ?', [req.session.idSesion,req.session.idSesion], (err, prom) => {
                
                req.session.info = JSON.stringify(prom);
                res.render('plantillas/tiempos', req.session);
            });
        });

        
    }
    else{
        res.render('plantillas/login');
    }
}



module.exports = {
    estadisticas,
    acerdaDE,
    tiempos
}


function formatTime(time) {
    var milliseconds = Math.floor(time % 1000 / 100);
    var seconds = Math.floor(time / 1000) % 60;
    var minutes = Math.floor(time / 1000 / 60);

    var timeString = '';

    if (minutes > 0) {
        timeString += padZero(minutes, 2) + ':';
    }

    timeString += padZero(seconds, 2) + '.' + milliseconds;

    return timeString;
}

function padZero(num, width) {
    var numString = num.toString();
    while (numString.length < width) {
        numString = '0' + numString;
    }
    return numString;
}