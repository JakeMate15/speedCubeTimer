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
    inspeccion boolean,
    mostrarTiempo boolean
);

-- Crear la tabla "sesion"
CREATE TABLE sesion (
    idSesion INT AUTO_INCREMENT PRIMARY KEY,
    nombreSesion VARCHAR(255),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

-- Crear la tabla "tiempo"
CREATE TABLE tiempo (
    idTiempo INT AUTO_INCREMENT PRIMARY KEY,
    tiempo TIME,
    fecha DATE,
    valido BOOLEAN,
    idMezcla INT,
    FOREIGN KEY (idMezcla) REFERENCES mezcla(idMezcla),
    idSesion INT,
    FOREIGN KEY (idSesion) REFERENCES sesion(idSesion)
);

-- Crear la tabla "mezcla"
CREATE TABLE mezcla (
    idMezcla INT AUTO_INCREMENT PRIMARY KEY,
    mezcla VARCHAR(255)
);


SELECT nombreSesion FROM sesion WHERE idUsuario = idUsuario;
drop database timer

select * from usuario
