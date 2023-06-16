var timerHtml = document.getElementById('cronometro');
var tiempoInicio;
var corriendo = false;
var idTiempo;

function toggleTimer() {
    if (corriendo) {
        corriendo = false;
        clearTimeout(idTiempo);
        $("#sesionOp, #mezclaOp").change(); 
    } else {
        corriendo = true;
        tiempoInicio = Date.now();
        actualizaTiempo();
    }
}

function actualizaTiempo() {
    var tiempoActual = Date.now();
    var tiempoOcurrido = tiempoActual - tiempoInicio;
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
        var selectedOption = $(this).val();

        if (selectedOption === "Nueva") {
            // Show the modal when "Nueva" is selected
            $('#nuevaSesionModal').modal('show');
        }
    });

    // Handle the click event of the "Guardar" button inside the modal
    $("#guardarSesionBtn").click(function() {
        var nombreSesion = $("#nombreSesionInput").val();

        // Perform the database insertion with the nombreSesion value
        // ...

        // Update the dropdown value and close the modal
        $("#sesionOp").val(nombreSesion);
        $('#nuevaSesionModal').modal('hide');
    });
});