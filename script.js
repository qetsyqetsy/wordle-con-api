// Elementos del DOM
const button = document.getElementById("guess-button");
const input = document.getElementById("guess-input");
const grid = document.getElementById("grid");
const guesses = document.getElementById("guesses");
const confettiDiv = document.getElementById('confetti');
const again = document.getElementById("try-again");

// Datos del juego
const diccionario = ['ABEJA', 'BELLO', 'CABLE', 'DULCE', 'ELEVO', 'FLORA',
                    'GLOBO', 'HELIO', 'IGUAL', 'JUEGO', 'LLAVE', 'MUCHO',
                    'NADAR', 'OROJO', 'PLOMO', 'QUESO', 'RUIDO', 'SILLA', 
                    'TABLA', 'VAPOR', 'XENÓN', 'YOGUR'];

const palabra = obtenerPalabraAleatoria(diccionario);
let intentos = 6;

// Listeners de eventos
window.addEventListener('load', inicializar);
button.addEventListener("click", function() {
    jugar();
    reproducirMusica();
});
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        jugar();
        reproducirMusica();
    }
});
again.addEventListener('click', () => location.reload());

// Función de inicialización
function inicializar() {
    confettiDiv.style.display = 'none';
}

// Función para reproducir música automáticamente desde YouTube
function reproducirMusica() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function() {
        const player = new YT.Player('music-player', {
            height: '0',
            width: '0',
            videoId: 'USqZr9eZ_As', // Reemplazar con el ID del video de YouTube
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                }
            }
        });
    };
}

// Función principal del juego
function jugar() {
    const intento = obtenerIntento();
    input.value = ''; 

    if (intento.length !== 5) {
        mostrarMensaje('¡Intente de nuevo, la palabra debe tener 5 letras!');
        return;
    }

    const fila = crearFilaDeLetras(intento);

    grid.appendChild(fila);
    intentos--;

    if (intento === palabra) terminarJuego('¡GANASTE!', true);
    else if (intentos === 0) terminarJuego('¡PERDISTE! :(', false);

    input.focus();
}

// Función para obtener una palabra aleatoria del diccionario
function obtenerPalabraAleatoria(diccionario) {
    return diccionario[Math.floor(Math.random() * diccionario.length)];
}

// Función para obtener el intento del usuario
function obtenerIntento() {
    return input.value.toUpperCase();
}

// Función para crear una fila de letras con el resultado del intento
function crearFilaDeLetras(intento) {
    const fila = document.createElement('div');
    fila.className = 'row';

    for (let i = 0; i < palabra.length; i++) {
        const color = obtenerColorParaLetra(intento[i], i);
        fila.appendChild(crearCelda(intento[i], color));
    }

    return fila;
}

// Función para obtener el color de fondo de una letra en la fila
function obtenerColorParaLetra(letra, indice) {
    if (letra === palabra[indice]) return '#79b851'; // Verde si la letra está en la posición correcta
    if (palabra.includes(letra)) return '#f3c237';   // Amarillo si la letra está en la palabra pero en la posición incorrecta
    return '#a4aec4';                                // Gris por defecto
}

// Función para crear una celda de letra con el color dado
function crearCelda(letra, color) {
    const celda = document.createElement('span');
    celda.className = 'letter';
    celda.textContent = letra;
    celda.style.backgroundColor = color;
    return celda;
}

// Función para mostrar mensajes y manejar el final del juego
function mostrarMensaje(mensaje) {
    guesses.innerHTML = `<h2>${mensaje}</h2>`;
    setTimeout(() => guesses.innerHTML = '', 5000);
}

function terminarJuego(mensaje, ganaste) {
    mostrarMensaje(mensaje);
    confettiDiv.style.display = ganaste ? 'block' : 'none';
    input.disabled = true;
    button.disabled = true;
    again.style.display = 'block';
}
