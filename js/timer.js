
let days = document.getElementById('timer-days'),
    hours = document.getElementById('timer-hour'),
    minutes = document.getElementById('timer-minute'),
    segundo = document.getElementById('timer-segundo');

// FECHA OBJETIVO DEL TEMPORIZADOR
let fechaObjetivo = new Date('2025/09/13 08:00:00');

// ACTUALIZA EL TEMPORIZADOR CADA SEGUNDO
let temporizador = setInterval(() => {
    let ahora = new Date();
    let diferencia = fechaObjetivo - ahora;

    // Si la fecha ya pasó, detener el temporizador
    if (diferencia <= 0) {
        clearInterval(temporizador);
        days.innerText = '00';
        hours.innerText = '00';
        minutes.innerText = '00';
        segundo.innerText = '00';
        return;
    }

    // Calcular días, horas, minutos y segundos restantes
    let segundosTotales = Math.floor(diferencia / 1000);
    let diasRestantes = Math.floor(segundosTotales / 86400);
    let horasRestantes = Math.floor((segundosTotales % 86400) / 3600);
    let minutosRestantes = Math.floor((segundosTotales % 3600) / 60);
    let segundosRestantes = segundosTotales % 60;

    // Mostrar valores con formato 2 dígitos
    days.innerText = diasRestantes < 10 ? `0${diasRestantes}` : diasRestantes;
    hours.innerText = horasRestantes < 10 ? `0${horasRestantes}` : horasRestantes;
    minutes.innerText = minutosRestantes < 10 ? `0${minutosRestantes}` : minutosRestantes;
    segundo.innerText = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;

}, 1000); // Ejecutar cada 1 segundo