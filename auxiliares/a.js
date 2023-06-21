function obtenAvg() {
    const idSesion = document.getElementById('sesionOp').value;
    $.ajax({
        url: '/obtenTiempos',
        method: 'GET',
        data: { idSesion: idSesion },
        success: function(response) {
            const tiempos = response.tiempos;
            var avg5 = -1,ao12 = -1;
        
            if (tiempos.length >= 5) {
                var primeros5 = tiempos.slice(0, 5).sort(function(a, b) {
                    return a.tiempo - b.tiempo;
                });
        
                var tiemposIntermedios = primeros5.slice(1, -1).reduce(function(sum, objeto) {return sum + objeto.tiempo;}, 0);
                avg5 = (tiemposIntermedios/3).toFixed(2);
            }
        
            if (tiempos.length >= 12) {
                var ultimos12 = tiempos.slice(-12);
                ao12 = (ultimos12.reduce((sum, objeto) => sum + objeto.tiempo, 0) / ultimos12.length).toFixed(2);
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