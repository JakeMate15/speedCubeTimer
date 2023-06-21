create database timer
use timer
-- Crear la tabla "usuario"
CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255),
    correo VARCHAR(255),
    pass VARCHAR(255),
    colorBoton VARCHAR(255),
    colorTexto VARCHAR(255),
    colorFondo VARCHAR(255),
    colorContenedores VARCHAR(255),
    inspeccion BOOLEAN,
    ocultarTmp BOOLEAN
);

-- Crear la tabla "sesion"
CREATE TABLE sesion (
    idSesion INT AUTO_INCREMENT PRIMARY KEY,
    nombreSesion VARCHAR(255),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE tmp (
  idTiempo INT AUTO_INCREMENT PRIMARY KEY,
  tiempo INT,
  fecha DATE,
  valido BOOLEAN,
  mezcla VARCHAR(255),
  idSesion INT,
  FOREIGN KEY (idSesion) REFERENCES sesion(idSesion)
);


select * from sesion where idUsuario = 1 AND idSesion = 1
select * from usuario
select * from tmp


SELECT tiempo FROM tmp WHERE idSesion = 1 AND idUsuario = 1



select * from tmp where idSesion = 1 ORDER BY idTiempo DESC LIMIT 12