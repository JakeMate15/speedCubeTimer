var timerHtml = document.getElementById('cronometro');
var tiempoInicio;
var corriendo = false;
var idTiempo;
var tiempoOcurrido;

function toggleTimer() {
    if (corriendo) {
        corriendo = false;
        clearTimeout(idTiempo);
        guardarTiempo();
        obtenAvg();
        $("#sesionOp, #mezclaOp").change(); 
    } else {
        corriendo = true;
        tiempoInicio = Date.now();
        actualizaTiempo();
    }
}

function actualizaTiempo() {
    var tiempoActual = Date.now();
    tiempoOcurrido = tiempoActual - tiempoInicio;
    var formatoTiempo = formatTime(tiempoOcurrido);
    timerHtml.textContent = formatoTiempo;

    if (corriendo) {
        idTiempo = setTimeout(actualizaTiempo, 2);
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

function convertirAMilisegundos(tiempo) {
    var partes = tiempo.split(':');
    var segundos = 0;

    if(partes.length == 1){
        segundos = parseFloat(partes[0]);
    }
    else{
        segundos = parseInt(partes[0]) * 60 + parseFloat(partes[1]);
    }

    return segundos * 1000;
}

$(document).ready(function() {
    $("#sesionOp, #mezclaOp").change(function() {
        var sesion = $("#sesionOp").val();
        var tipoMezc = $("#mezclaOp").val();
        var mezcla = "";

        switch (tipoMezc) {
            case "wca":
                mezcla = scramble_333.genWca();
                break;
            case "cruzR":
                mezcla = scramble_333.genF2L();
                break;
            case "LL":
                mezcla = scramble_333.genLL();
                break;
            case "esquinas":
                mezcla = scramble_333.genAristas();
                break;
            case "aristas":
                mezcla = scramble_333.genEsq();
                break;
        }

        $("#scrTimer").text(mezcla);
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            toggleTimer();
        }
    });

    $("#mas2").click(function() {
        var tiempo = timerHtml.textContent;

        if(tiempo != 'DNF' && tiempo != 'Borrado'){
            var tiempoEnMilisegundos = convertirAMilisegundos(tiempo);
            tiempoEnMilisegundos+=2000;
            timerHtml.textContent = formatTime(tiempoEnMilisegundos);
        }
    });

    $("#dnf").click(function() {
        timerHtml.textContent = "DNF";
    });

    $("#borrar").click(function() {
        timerHtml.textContent = "Borrado";
    });

    $("#sesionOp").change(function() {
        var idSesion = $(this).val();
        

        if (idSesion === "Nueva") {
            $('#nuevaSesionModal').modal('show');
        }
        else{
            actualizaSesion(idSesion);
        }
    });

    $("#guardarSesionBtn").click(function() {
        var nombreSesion = $("#nombreSesionInput").val();
        $("#sesionOp").val(nombreSesion);
        $('#nuevaSesionModal').modal('hide');
    });
});

function guardarTiempo() {
    var t = timerHtml.textContent;
    const tiempo = (timerHtml.textContent == "DNF" || timerHtml.textContent == "Borrado") ? 0 : convertirAMilisegundos(t);
    const fecha = new Date().toISOString().split('T')[0];
    const valido = (timerHtml.textContent == "DNF" || timerHtml.textContent == "Borrado") ? 0 : 1;
    const mezcla = document.getElementById('scrTimer').textContent;
    const idSesion = document.getElementById('sesionOp').value;

    $.ajax({
        url: '/guardar-tiempo',
        method: 'POST',
        data: { tiempo, fecha, valido, mezcla, idSesion },
        success: function (response) {
            //console.log("Insertado");
        },
        error: function (error) {
            console.error('Error al guardar el tiempo:', error);
        }
    });

}

function actualizaSesion(idSesion){

    $.ajax({
        url: '/cambiaSesion',
        method: 'POST',
        data: {idSesion},
        success: function(response){
            //console.log(response);
        },
        error: function (error) {
            //console.error('Error al guardar el tiempo:', error);
        }
    });
}

function obtenAvg() {
    const idSesion = document.getElementById('sesionOp').value;
    $.ajax({
        url: '/obtenTiempos',
        method: 'GET',
        data: { idSesion: idSesion },
        success: function(response) {
            const tiempos = response.tiempos;
            var avg5 = -1,ao12 = -1;

            if (tiempos.length >= 12) {
                var ultimos12 = tiempos.slice(-12);
                ao12 = (ultimos12.reduce((sum, objeto) => sum + objeto.tiempo, 0) / ultimos12.length).toFixed(2);
            
                if(ao12 < Number(response.records.ao12) ){
                    //nuevoA12(tiempos.slice(-12), Number(ao12), (Number(response.records.ao12)));
                }
            }
        
            if (tiempos.length >= 5) {
                var primeros5 = tiempos.slice(0, 5).sort(function(a, b) {
                    return a.tiempo - b.tiempo;
                });
              
                var tiemposIntermedios = primeros5.slice(1, -1).reduce(function(sum, objeto) {
                    return sum + objeto.tiempo;
                }, 0);

                avg5 = (tiemposIntermedios / 3).toFixed(2);

                if(avg5 < Number(response.records.avg5) ){
                    //nuevoA5(tiempos.slice(0,5), formatTime(avg5), (Number(response.records.avg5)));
                }
            }
            
            if(tiempos.length>=1){
                //console.log("Tiempo nuevo " + tiempos[0].tiempo);
                //console.log("Mejor " + response.records.pb);

                if(  Number(tiempos[0].tiempo)  < Number(response.records.pb) ){
                    nuevoPv(tiempos[0], (Number(tiempos[0].tiempo)), (Number(response.records.pb)));
                }
            }

            if(avg5 == -1){
                document.getElementById('avg5').textContent = 'avg5: -';
            }
            else{
                document.getElementById('avg5').textContent = 'avg5: ' + formatTime(avg5);
            }

            if(ao12 == -1){
                document.getElementById('ao12').textContent = 'ao12: -';
            }
            else{
                document.getElementById('ao12').textContent = 'ao12: ' + formatTime(ao12);
            }
        },        
        error: function(error) {
            console.log("Hay un error");
        }
    });
}


function nuevoPv(datos, nuevo, anterior) {
    if(anterior == 2147483637)  mostrarModal("tiempo", formatTime(nuevo), '-');
    else                        mostrarModal("tiempo", formatTime(nuevo), formatTime(anterior));
    
    console.log(datos);
    $.ajax({
        url: '/nvoPb',
        method: 'POST',
        data: {nuevo, datos},
        success: function(response){
            //console.log(response);
        },
        error: function (error) {
            //console.error('Error al guardar el tiempo:', error);
        }
    });
}

function nuevoA5(datos, nuevo, anterior) {
    if(anterior == 2147483637)  mostrarModal("tiempo", formatTime(nuevo), '-');
    else                        mostrarModal("tiempo", formatTime(nuevo), formatTime(anterior));
    // Resto de tu lógica
}

function nuevoA12(datos, nuevo, anterior) {
    if(anterior == 2147483637)  mostrarModal("tiempo", nuevo, '-');
    else                        mostrarModal("tiempo", nuevo, formatTime(anterior));
    // Resto de tu lógica
}

function mostrarModal(nombreFuncion, nuevo, anterior) {
    $('#nuevoMejorModal').modal('show');
    $('#nuevoMejorModal').find('.modal-title').text("Nuevo mejor " + nombreFuncion);
    $('#nuevoMejorModal').find('.modal-body').find('p:nth-child(1)').text("Anterior: " + anterior);
    $('#nuevoMejorModal').find('.modal-body').find('p:nth-child(2)').text("Nuevo: " + nuevo);
}
