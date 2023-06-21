const mysql = require('mysql');

function timer(req, res) {
    if (req.session.loggedin == true) {
        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                const idUsuario = req.session.idUsr;
                conn.query('SELECT * FROM sesion WHERE idUsuario = ?', [idUsuario], (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.render('error');
                    } else {
                        obtenAvg(conn, rows, res, req.session);
                    }
                });
            }
        });
    } else {
        res.render('plantillas/login');
    }
}

function obtenAvg(conn, sesiones, res, sessionData) {
    if (sesiones.length > 0) {
        const idSesion = sesiones[0].idSesion;

        const consulta = 'SELECT tiempo FROM tmp WHERE idSesion = ? ORDER BY idTiempo DESC LIMIT 12';
        conn.query(consulta, [idSesion], (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                var avg5 = -1, ao12 = -1;

                if (result.length >= 5) {
                    var primeros5 = result.slice(0, 5).sort(function(a, b) {
                        return a.tiempo - b.tiempo;
                    });

                    var tiemposIntermedios = primeros5.slice(1, -1).reduce(function(sum, objeto) {
                        return sum + objeto.tiempo;
                    }, 0);

                    avg5 = formatTime(tiemposIntermedios / 3);
                }

                if (result.length >= 12) {
                    var ultimos12 = result.slice(-12);
                    ao12 = formatTime(ultimos12.reduce((sum, objeto) => sum + objeto.tiempo, 0) / ultimos12.length);
                }

                res.render('plantillas/timer', { sesiones: sesiones, avg5: avg5, ao12: ao12, ...sessionData });
            }
        });
    } else {
        res.render('plantillas/timer', { sesiones: sesiones, avg5: -1, ao12: -1, ...sessionData });
    }
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

  

function estadisticas(req,res){
    if(req.session.loggedin == true){
        res.render('plantillas/estadisticas', req.session);
    }
    else{
        res.render('plantillas/login');
    }
}

function guardarNuevaSesion(req, res) {
    if(req.session.loggedin == true){
        const datos = {
            nombreSesion: req.body.nombreSesion,
            idUsuario: req.session.idUsr
        };
    
        req.getConnection((err, conn) => {
            const consulta = 'INSERT INTO sesion SET ?';
            conn.query(consulta, [datos], (err, result) => {
                res.redirect('timer');
            });
        });
    }
    else{
        res.redirect('login');
    }
}

function guardarTiempo(req, res) {
    if(req.session.loggedin == true){

        req.getConnection((err, conn) => {
            const consulta = 'INSERT INTO tmp SET ?';
            conn.query(consulta, [req.body], (err, result) => {
                if(err){
                    console.log(err);
                }
                res.redirect('timer');
            });
        });
        
    }
    else{
        res.redirect('login');
    }
}

function obtenTiempos(req, res){
    if(req.session.loggedin == true){
        const idSesion = req.query.idSesion;

        req.getConnection((err, conn)=>{
            const consulta = 'select tiempo from tmp where idSesion = ? ORDER BY idTiempo DESC LIMIT 12';
            conn.query( consulta, [idSesion], (err, result)=> {
                if(err){
                    console.log(err);
                }

                res.json(result);
            });
        });
        
 
    }
    else{
        res.redirect('login');
    }
}

function cambiaSesion(req,res){
    if(req.session.loggedin == true){
        req.session.idSesion = req.body.idSesion
        res.redirect('timer');
    }
    else{
        res.redirect('login');
    }
}



module.exports = {
    timer,
    estadisticas,
    guardarNuevaSesion,
    guardarTiempo,
    obtenTiempos,
    cambiaSesion
};