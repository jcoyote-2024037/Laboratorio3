let puzzleContainer = document.getElementById("puzzle");
let mensaje = document.getElementById("mensaje");
let timerElement = document.getElementById("temporizador");
let piezas = [];
let estado = [];
let tiempoRestante = 1200; 
let temporizador;

for (let i = 1; i <= 15; i++) {
    piezas.push(`img/pieza${i}.webp`);
}
piezas.push("");

// Función para mezclar piezas
function mezclar(array){
    let copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Dibujar el puzzle
function dibujar() {
    puzzleContainer.innerHTML = "";
    estado.forEach((valor, i) => {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        if (valor === "") {
            celda.classList.add("vacio");
        } else {
            let img = document.createElement("img");
            img.src = valor;
            img.classList.add("pieza-img");
            celda.appendChild(img);
            celda.addEventListener("click", () => mover(i));
        }
        puzzleContainer.appendChild(celda);
    });
}

// Intentar mover pieza
function mover(indice){
    let vacio = estado.indexOf("");
    let filas = 4;
    let col = indice % filas;
    let fila = Math.floor(indice / filas);
    let colVacio = vacio % filas;
    let filaVacio = Math.floor(vacio / filas);
    
    // Verificar si es adyacente
    if ((Math.abs(col - colVacio) === 1 && fila === filaVacio) ||
        (Math.abs(fila - filaVacio) === 1 && col === colVacio)) {
        [estado[indice], estado[vacio]] = [estado[vacio], estado[indice]];
        dibujar();
        verificar();
    } 
}

// Verificar si ganó
function verificar(){
    if(JSON.stringify(estado) === JSON.stringify(piezas)){
        clearInterval(temporizador);
        let tiempoUsado = 1200 - tiempoRestante;
        alert( "🎉 ¡Felicidades! Completaste el rompecabezas ");
    }
}

function formatearTiempo(seg){
    let m = String(Math.floor(seg / 60)).padStart(2, "0");
    let s = String(seg % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function iniciarTemporizador(){
    clearInterval(temporizador);
    tiempoRestante = 1200; 
    actualizarDisplay();
    
    temporizador = setInterval(function(){
        tiempoRestante--;
        actualizarDisplay();
        
        if (tiempoRestante === 0.00) {
            clearInterval(temporizador);
            alert ("⏰ ¡Se acabó el tiempo! Inténtalo de nuevo." );
            deshabilitarJuego();
        }
    }, 1200);
}

function actualizarDisplay() {
    timerElement.innerText = "Tiempo Restante: " + formatearTiempo(tiempoRestante);
    
    // Cambiar color cuando queda poco tiempo 
    if (tiempoRestante <= 60) { 
        timerElement.style.color = "red";
    } else if (tiempoRestante <= 120) { 
        timerElement.style.color = "orange";
    } else {
        timerElement.style.color = "";
    }
}

function deshabilitarJuego() {
    let celdas = document.querySelectorAll('.celda');
    celdas.forEach(celda => {
        celda.style.pointerEvents = 'none';
        celda.style.opacity = '0.6';
    });
}

function habilitarJuego() {
    let celdas = document.querySelectorAll('.celda');
    celdas.forEach(celda => {
        celda.style.pointerEvents = '';
        celda.style.opacity = '';
    });
}

function detenerTemporizador(){
    clearInterval(temporizador);
}

// Reiniciar Juego
function reiniciar(){
    estado = mezclar(piezas);
    mensaje.innerText = "";
    timerElement.style.color = ""; // Resetear color
    habilitarJuego(); // Rehabilitar el juego
    dibujar();
    iniciarTemporizador();
}

// Iniciar al cargar
reiniciar();