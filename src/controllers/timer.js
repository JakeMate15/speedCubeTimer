const mysql = require('mysql');

function timer(req, res) {
    if (req.session.loggedin == true) {
        req.getConnection((err, conn) => {
            const idUsuario = req.session.idUsr;
            conn.query('SELECT * FROM sesion WHERE idUsuario = ?', [idUsuario], (err, rows) => {
                res.render('plantillas/timer', { sesiones: rows, ...req.session });
            
            });
        });
    } 
    else {
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