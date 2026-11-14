// =================================================================
// TP FINAL PARTE 2 - MINIJUEGO EN PROGRAMACIÓN ORIENTADA A OBJETOS
// Título: ¡Es Hora de Levantarse, Querido! - Camino a la Oficina
// Alumnos: Arian Imanoni (125600/9) e Iván Ledesma (94422/4)
// VIDEO ARIAN IMANONI: https://www.youtube.com/watch?v=rzWv9DaZ7WE
// Resolución: 800x400
// =================================================================

let juego;
let sonidos = {};

// Variables globales para las imágenes
let imgPortada;
let imgCalle;
let imgCiclista;
let imgRepartidor;
let imgBache;
let imgsAutos = [];

// -----------------------------------------------------------------
// PRELOAD: Carga de todas las imágenes y sonidos del proyecto
// -----------------------------------------------------------------
function preload() {
  soundFormats('mp3');
  sonidos["redondos"] = loadSound('data/sonidos/redondos.mp3');

  imgPortada = loadImage('data/imagenes/portada.png');
  imgCalle = loadImage('data/imagenes/calle.png');
  imgCiclista = loadImage('data/imagenes/ciclista.png');
  imgRepartidor = loadImage('data/imagenes/repartidor.png');
  imgBache = loadImage('data/imagenes/bache.png');
  
  // Carga los 4 modelos de autos en un arreglo
  for (let i = 1; i <= 4; i++) {
    imgsAutos.push(loadImage('data/imagenes/auto' + i + '.png'));
  }
}

// ---------------------------
// SETUP Y DRAW PRINCIPALES
// ---------------------------
function setup() {
  createCanvas(800, 400);
  textFont('Trebuchet MS');
  juego = new Juego();
}

function draw() {
  juego.actualizar();
  gestionarSonidosAmbiente();
}

function mousePressed() {
  userStartAudio(); // Habilita el audio con el primer clic
  juego.manejarClic();
}

function keyPressed() {
  userStartAudio(); // Habilita el audio si se presiona una tecla
  juego.manejarTecla();
}

function gestionarSonidosAmbiente() {
  // Previene que se ejecute audio antes de que el usuario interactúe con el navegador
  if (getAudioContext().state !== 'running') {
    return;
  }

  if (sonidos["redondos"] && sonidos["redondos"].isLoaded()) {
    if (!sonidos["redondos"].isPlaying()) {
      sonidos["redondos"].setVolume(0.05); 
      sonidos["redondos"].loop();
    }
  }
}
