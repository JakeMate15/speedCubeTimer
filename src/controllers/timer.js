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


module.exports = {
    timer,
    estadisticas,
    guardarNuevaSesion
};
