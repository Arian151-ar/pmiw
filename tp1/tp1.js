// ===================================================
// Arian Imanoni, Comisión 3, Legajo 125600/9
// ===================================================

// Constantes de la máquina de estados
const Estado_Estar = 0;
const Estado_Caminar = 1;
const Estado_Accion = 2;

// Variables
let estadoActual = Estado_Estar;
let posX = 400;
let posY = 480;
let dirX = 1;
let frameInicialEstado = 0;
let escalaNaruto = 2.2; 
let imgFondo;
let animEstar = [];
let animCaminar = [];
let animAccion = [];

function preload() {
  imgFondo = loadImage('data/Konoha.png');

  for (let i = 0; i <= 3; i++) {
    let nombreArchivo = 'data/' + nf(i, 4) + 'Naruto.png';
    animEstar[i] = loadImage(nombreArchivo);
  }

  for (let i = 0; i <= 5; i++) {
    let nombreArchivo = 'data/' + nf(i, 4) + 'NarutoCorre.png';
    animCaminar[i] = loadImage(nombreArchivo);
  }

  animAccion = animCaminar;
}

function setup() {
  createCanvas(800, 600); 
  imageMode(CENTER);
}

function draw() {
  background(0);
  image(imgFondo, width / 2, height / 2, width, height);

  procesarTeclado();

  switch (estadoActual) {
    case Estado_Estar:
      // Animación de reposo
      reproducirAnimacion(animEstar, posX, posY, 12, escalaNaruto, dirX);
      break;

    case Estado_Caminar:
      // Desplazamiento horizontal
      posX += dirX * 4;
      posX = constrain(posX, 60, width - 60);
      reproducirAnimacion(animCaminar, posX, posY, 6, escalaNaruto, dirX);
      break;

    case Estado_Accion:
      // Animación de acción rápida de ciclo único
      reproducirAnimacion(animAccion, posX, posY, 4, escalaNaruto, dirX);
      if (esAnimacionCompletada(animAccion.length, 4)) {
        cambiarEstado(Estado_Estar, true);
      }
      break;
  }

  // tarjeta con los controles en la esquina superior derecha
  dibujarControles();
}

// ===================================================
// FUNCIONES PROPIAS CON PARÁMETROS
// ===================================================

// Función propia para dibujar la caja de controles
function dibujarControles() {
  push();
  rectMode(CORNER);
  
  noStroke();
  fill(0, 0, 0, 160);
  rect(width - 170, 10, 160, 95, 8);

  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  
  let startX = width - 160;
  let startY = 20;

  textStyle(BOLD);
  text("CONTROLES", startX, startY);
  
  textStyle(NORMAL);
  text("← / → : Moverse", startX, startY + 20);
  text("Espacio : Acción", startX, startY + 38);
  text("R : Reiniciar", startX, startY + 56);
  pop();
}

// Función genérica reutilizable para dibujar arreglos de frames
function reproducirAnimacion(framesArray, x, y, velocidadFrame, escala, direccion) {
  if (!framesArray || framesArray.length === 0) return;

  let indice = obtenerFrameActual(framesArray.length, velocidadFrame);

  push();
  translate(x, y);
  scale(direccion * escala, escala);
  image(framesArray[indice], 0, 0);
  pop();
}

// Función para gestionar transiciones de la máquina de estados
function cambiarEstado(nuevoEstado, reiniciarTiempo) {
  if (estadoActual !== nuevoEstado) {
    estadoActual = nuevoEstado;
    if (reiniciarTiempo) {
      frameInicialEstado = frameCount;
    }
  }
}

// ===================================================
// FUNCIONES PROPIAS CON RETORNO DE VALOR
// ===================================================

// Función con retorno: retorna el índice de frame calculado según frameCount
function obtenerFrameActual(totalFrames, velocidadFrame) {
  let transcurridos = frameCount - frameInicialEstado;
  return floor(transcurridos / velocidadFrame) % totalFrames;
}

// Función con retorno: Determina mediante un valor booleano si la animación finalizó
function esAnimacionCompletada(totalFrames, velocidadFrame) {
  let transcurridos = frameCount - frameInicialEstado;
  return transcurridos >= totalFrames * velocidadFrame;
}

// ===================================================
// CONTROLES Y REINICIO
// ===================================================

function procesarTeclado() {
  if (estadoActual !== Estado_Accion) {
    if (keyIsDown(LEFT_ARROW)) {
      dirX = -1;
      cambiarEstado(Estado_Caminar, false);
    } else if (keyIsDown(RIGHT_ARROW)) {
      dirX = 1;
      cambiarEstado(Estado_Caminar, false);
    } else {
      cambiarEstado(Estado_Estar, false);
    }
  }
}

function keyPressed() {
  // Apretar Espacio activa estado de acción
  if (key === ' ' && estadoActual !== Estado_Accion) {
    cambiarEstado(Estado_Accion, true);
  }

  // Apretar R reinicia al estado inicial y posición original
  if (key === 'r' || key === 'R') {
    posX = 400;
    posY = 480;
    dirX = 1;
    cambiarEstado(Estado_Estar, true);
  }
}
