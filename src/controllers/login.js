const bcrypt = require('bcrypt');

function login(req, res) {
    if(req.session.loggedin == true){
        res.redirect('timer');
    }
    else{
        res.render('plantillas/login');
    }
}

function obtenerValoresSesion(conn) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT avg5, ao12, pb FROM sesion WHERE idSesion = ?', [1], (err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                const records = result[0];
                resolve(records);
            }
        });
    });
}
  
function iniciarSesion(req, res) {
    const data = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE correo = ?', [data.correo], (err, userdata) => {
            if (userdata.length > 0) {
                userdata.forEach((element) => {
                    bcrypt.compare(data.pass, element.pass, (err, isMatch) => {
                        if (!isMatch) {
                        res.render('plantillas/login', { error: 'Credenciales no válidas' });
                    } 
                    else {
                        req.session.loggedin = true;
                        req.session.nombre = element.Nombre;
                        req.session.idUsr = element.idUsuario;
                        req.session.btn = element.colorBoton;
                        req.session.txt = element.colorTexto;
                        req.session.fondo = element.colorFondo;
                        req.session.contenedores = element.colorContenedores;
                        req.session.mostrarTiempo = element.ocultarTmp;
                        req.session.inspeccion = 1;
                        req.session.idSesion = 1;
                        req.session.ocultarTmp = 0;
  
                        Promise.all([obtenerValoresSesion(conn)])
                        .then(([records]) => {
                            req.session.bavg5 = records.avg5;
                            req.session.bao12 = records.ao12;
                            req.session.bpb = records.pb;
                            req.session.iBp = records.iPb;
                            
                            res.redirect('timer');
                        })
                        .catch((err) => {
                            console.error(err);
                            res.render('plantillas/login', { error: 'Error al obtener los valores de sesión' });
                        });
                    }
                });
            });
        } 
        else {
            res.render('plantillas/login', { error: 'Credenciales no válidas' });
        }});
    });
}
  

function registro(req, res) {

    if(req.session.loggedin == true){
        res.redirect('timer');
    }
    else{
        res.render('plantillas/registro');
    }
}

function alta(req, res) {
    const data = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE correo = ?', [data.correo], (err, userdata) => {
            if (userdata.length > 0) {
            res.render('plantillas/registro', { error: '¡El correo ya ha sido registrado!' });
            } 
            else {
                if (data.pass == data.confimacionPass) {
                    bcrypt.hash(data.pass, 12).then(hash => {
                        data.pass = hash;
                        data.colorBoton = '#000000';
                        data.colorTexto = '#000000';
                        data.colorFondo = '#000000';
                        data.colorContenedores = '#000000';
                        data.inspeccion = 1;
                        data.ocultarTmp = 0;
            
                        delete data.confimacionPass;
            
                        req.getConnection((err, conn) => {
                            conn.query('INSERT INTO usuario SET ?', [data], (err, rows) => {
                                const idUsuario = rows.insertId;
                                req.session.idUsr = idUsuario;

                                const nuevaSesion = {
                                    nombreSesion: 1, 
                                    avg5: 2147483637,
                                    ao12: 2147483637,
                                    pb: 2147483637,
                                    iPb: -1,
                                    idUsuario: idUsuario
                                };
            
                                conn.query('INSERT INTO sesion SET ?', [nuevaSesion], (err, sesionRows) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    res.redirect('/');
                                });
                            });
                        });
                    });
                } 
                else {
                    res.render('plantillas/registro', { error: 'Las contraseñas no coinciden' });
                }
            }
        });
    });
}

function cambiarDatos(req, res) {
    const data = req.session;
    const newData = req.body;
    console.log(newData);
    console.log(data);
  
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE idUsuario = ?', [data.idUsr], (err, userdata) => {
            //Por si las duda revisar el código de iniciarSesion 
            console.log(userdata);
            if (userdata.length > 0) {
                userdata.forEach((element) => {
                    bcrypt.compare(newData.pass, element.pass, (err, isMatch) => {
                        if (!isMatch) {
                        res.render('plantillas/ajustes', { error: 'Contaseña incorrecta' });
                    } 
                    else {
                        bcrypt.hash(newData.newPass, 12).then(hash => {
                        conn.query('UPDATE usuario set Nombre= ?,pass = ? WHERE idUsuario = ? ', [newData.Nombre,hash,data.idUsr], (err, userdata) => {
                            req.session.nombre = newData.Nombre;
                            res.redirect('timer');
                        });
                        }); 
                    }
                });
            });
        } 
        else {
            res.render('plantillas/ajustes', { error: 'Contaseña incorrecta' });
        }});
    });
}

function irAjustes(req, res) {
    if(req.session.loggedin == true){
        res.render('plantillas/ajustes',req.session);
    }
    else{
        res.redirect('login');
    }
}
  
function cerrarSesion(req,res){
    if(req.session.loggedin == true){
        req.session.destroy();
        res.redirect('/login');
    }
    else{
        res.redirect('/login');
    }
}

module.exports = {
    login,
    registro,
    alta,
    iniciarSesion,
    cerrarSesion,
    cambiarDatos,
    irAjustes
}