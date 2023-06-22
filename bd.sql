create database timer
use timer

create database timer
use timer

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
    avg5 int, 
    ao12 int, 
    pb int,
    iPb int,
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


drop database timer

select * from sesion

SELECT avg5, ao12, pb FROM sesion WHERE idSesion = 1
select * from usuario