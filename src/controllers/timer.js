const mysql = require('mysql');

function timer(req, res) {
    if (req.session.loggedin == true) {
        //console.log(req.session);
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
                var a5 = -1, a12 = -1;

                if (result.length >= 5) {
                    var primeros5 = result.slice(0, 5).sort(function(a, b) {
                        return a.tiempo - b.tiempo;
                    });

                    var tiemposIntermedios = primeros5.slice(1, -1).reduce(function(sum, objeto) {
                        return sum + objeto.tiempo;
                    }, 0);

                    a5 = formatTime(tiemposIntermedios / 3);
                }

                if (result.length >= 12) {
                    var ultimos12 = result.slice(-12);
                    a12 = formatTime(ultimos12.reduce((sum, objeto) => sum + objeto.tiempo, 0) / ultimos12.length);
                }

                res.render('plantillas/timer', { sesiones: sesiones, avg5: a5, ao12: a12, ...sessionData });
            }
        });
    } 
    else {
        res.render('plantillas/timer', { sesiones: sesiones, avg5: '-', ao12: '-', ...sessionData });
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

/*
req.session.bavg5 = records.avg5;
                            req.session.bao12 = records.ao12;
                            req.session.bpb = records.pb;
                            req.session.iBp = records.iPb;
*/

function guardarNuevaSesion(req, res) {
    if(req.session.loggedin == true){
        const datos = {
            nombreSesion: req.body.nombreSesion,
            idUsuario: req.session.idUsr,
            avg5: 2147483637,
            ao12: 2147483637,
            pb: 2147483637,
            iPb: -1
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

function obtenTiempos(req, res) {
    if (req.session.loggedin == true) {
        const idSesion = req.query.idSesion;
        //console.log(req.session);

        req.getConnection((err, conn) => {
            const consulta = 'SELECT * FROM tmp WHERE idSesion = ? ORDER BY idTiempo DESC LIMIT 12';
            conn.query(consulta, [idSesion], (err, result) => {
                //console.log(req.query);
                
                const records = {
                    avg5: req.session.bavg5,
                    ao12: req.session.bao12,
                    pb: req.session.bpb
                };

                const responseData = {
                    tiempos: result,
                    records: records
                };

                res.json(responseData);
            });
        });
    } else {
        res.redirect('login');
    }
}

function cambiaSesion(req,res){
    if(req.session.loggedin == true){
        req.session.idSesion = req.body.idSesion

        req.getConnection((err, conn) => {
            const consulta = 'SELECT * FROM sesion WHERE idSesion = ?';
            conn.query(consulta, [req.session.idSesion], (err, result) => {
                //console.log(result);
                req.session.bavg5 = result[0].avg5;
                req.session.bao12 = result[0].ao12;
                req.session.bpb = result[0].pb;
                req.session.iBp = result[0].iPb;
                res.redirect('timer');
            });
        });

        
    }
    else{
        res.redirect('login');
    }
}


/*
req.session.bavg5 = records.avg5;
                            req.session.bao12 = records.ao12;
                            req.session.bpb = records.pb;
                            req.session.iBp = records.iPb;
*/
function nvoPb(req,res){
    if(req.session.loggedin == true){
        const nvo = req.body.nuevo;
        const i = req.body.datos.idTiempo;
        const iS = req.session.idSesion;

        req.session.pb = nvo;
        req.session.iBp = iS;
        
        
        req.getConnection((err, conn) => {
            const consulta = 'UPDATE sesion SET pb = ?, iPb = ? where idSesion = ?';
            conn.query(consulta, [nvo,i,iS], (err, result) => {
                res.redirect('timer');
            });
        });
    }
    else{
        res.redirect('login');
    }
}

function nvpA5(req,res){
    if(req.session.loggedin == true){
        const nvo = req.body.nuevo;
        const iS = req.session.idSesion;

        req.session.bavg5 = nvo;
        
        
        req.getConnection((err, conn) => {
            const consulta = 'UPDATE sesion SET avg5 = ? where idSesion = ?';
            conn.query(consulta, [nvo,iS], (err, result) => {
                res.redirect('timer');
            });
        });
    }
    else{
        res.redirect('login');
    }
}

function nvpA12(req,res){
    if(req.session.loggedin == true){
        const nvo = req.body.nuevo;
        const iS = req.session.idSesion;

        req.session.bao12 = nvo;

        req.getConnection((err, conn) => {
            const consulta = 'UPDATE sesion SET ao12 = ? where idSesion = ?';
            conn.query(consulta, [nvo,iS], (err, result) => {
                res.redirect('timer');
            });
        });
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
    cambiaSesion,
    nvoPb,
    nvpA5,
    nvpA12
};