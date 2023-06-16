const bcrypt = require('bcrypt');

function login(req, res) {
    if(req.session.loggedin == true){
        res.redirect('timer');
    }
    else{
        res.render('plantillas/login');
    }
}

function iniciarSesion(req, res){
    const data = req.body;
    
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM usuario WHERE correo = ?',[data.correo],(err,userdata) => {
            if(userdata.length > 0){
                userdata.forEach(element =>{
                    bcrypt.compare(data.pass, element.pass, (err,isMatch) => {
                        if(!isMatch){
                            res.render('plantillas/login', {error: 'Credenciales no válidas'});
                        }
                        else{
                            //console.log(element);
                            req.session.loggedin = true;
                            req.session.nombre = element.Nombre;
                            req.session.idUsr = element.idUsuario;
                            req.session.btn = element.colorBoton;
                            req.session.txt = element.colorTexto;
                            req.session.fondo = element.colorFondo;
                            req.session.contenedores = element.colorContenedores;
                            req.session.mostrarTiempo = element.mostrarTiempo;
                            req.session.inspeccion = element.inspeccion;
                            res.redirect('timer');
                        }
                    });
                });
            }
            else{
                res.render('plantillas/login', {error: 'Credenciales no válidas'});
            }
        });
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

function alta(req,res){
    const data = req.body;
    
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM usuario WHERE correo = ?', [data.correo],(err,userdata)=>{
            if(userdata.length > 0){
                res.render('plantillas/registro', {error: 'El correo ya ha sido registrado!'});
            }
            else{
                
                if(data.pass == data.confimacionPass){
                    bcrypt.hash(data.pass,12).then(hash=>{
                        data.pass = hash;
                        data.colorBoton = '#000000';
                        data.colorTexto = '#000000';
                        data.colorFondo = '#000000';
                        data.colorContenedores = '#000000';
                        data.inspeccion = true;
                        data.mostrarTiempo = false;

                        delete data.confimacionPass;
                
                        req.getConnection((err,conn)=>{
                            conn.query('INSERT INTO usuario SET ?', [data], (err,rows)=>{
                                //req.session
    
                                res.redirect('/');
                            });
                        })
                    });
                }
                else{
                    res.render('plantillas/registro', {error: 'Las contraseñas no coinciden'});
                }

            }
        });
    });
    
    
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
    cerrarSesion
}