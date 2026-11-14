// ==========================================================
// CLASE 1: JUEGO (Controlador de estados, tiempo y arreglos)
// ==========================================================
class Juego {
  constructor() {
    this.estado = "INICIO"; // INICIO, INSTRUCCIONES, JUGANDO, GANASTE, PERDISTE, CREDITOS
    this.duracionPartida = 30; // 30 segundos para llegar a la meta
    this.tiempoInicio = 0;
    this.tiempoRestante = this.duracionPartida;
    this.posicionYCreditos = 400;

    // Coordenadas X alineadas con los 4 carriles de calle.png
    this.carriles = [250, 350, 450, 550];
    this.calle = new Calle();
    this.ciclista = new Ciclista(350, 330);

    // Arreglos de obstáculos
    this.vehiculos = [];
    this.baches = [];
    this.inicializarObstaculos();
  }

  inicializarObstaculos() {
    this.vehiculos = [];
    this.baches = [];

    // Creamos 3 autos y 2 motos de repartidor en el arreglo de vehículos
    for (let i = 0; i < 3; i++) {
      let carrilAleatorio = random(this.carriles);
      let posYInicial = -120 - i * 190;
      this.vehiculos.push(new Vehiculo(carrilAleatorio, posYInicial, "auto"));
    }

    for (let i = 0; i < 2; i++) {
      let carrilAleatorio = random(this.carriles);
      let posYInicial = -220 - i * 240;
      this.vehiculos.push(new Vehiculo(carrilAleatorio, posYInicial, "moto"));
    }

    // Creamos 2 baches en el arreglo de baches
    for (let i = 0; i < 2; i++) {
      let carrilAleatorio = random(this.carriles);
      let posYInicial = -150 - i * 260;
      this.baches.push(new Bache(carrilAleatorio, posYInicial));
    }
  }

  iniciarPartida() {
    this.ciclista.reiniciar(350, 330);
    this.inicializarObstaculos();
    this.tiempoInicio = millis();
    this.tiempoRestante = this.duracionPartida;
    this.estado = "JUGANDO";
  }

  actualizar() {
    if (this.estado === "INICIO") {
      this.dibujarPantallaInicio();
    } else if (this.estado === "INSTRUCCIONES") {
      this.dibujarPantallaInstrucciones();
    } else if (this.estado === "CREDITOS") {
      this.dibujarPantallaCreditos();
    } else if (this.estado === "JUGANDO") {
      this.ejecutarLogicaJuego();
    } else if (this.estado === "GANASTE") {
      this.dibujarPantallaFinal(true);
    } else if (this.estado === "PERDISTE") {
      this.dibujarPantallaFinal(false);
    }
  }

  ejecutarLogicaJuego() {
    // 1. Actualizar fondo de calle en movimiento
    this.calle.actualizar();

    // 2. Calcular tiempo restante (30 segundos)
    let segundosPasados = floor((millis() - this.tiempoInicio) / 1000);
    this.tiempoRestante = max(0, this.duracionPartida - segundosPasados);

    if (this.tiempoRestante === 0) {
      this.estado = "GANASTE";
      return;
    }

    // 3. Actualizar y dibujar baches (van debajo de los vehículos)
    for (let i = 0; i < this.baches.length; i++) {
      this.baches[i].actualizar(this.carriles);
      if (this.ciclista.verificarChoque(this.baches[i])) {
        this.baches[i].reposicionar(this.carriles);
        this.procesarImpacto();
      }
    }

    // 4. Actualizar y dibujar vehículos (autos y repartidores)
    for (let i = 0; i < this.vehiculos.length; i++) {
      this.vehiculos[i].actualizar(this.carriles);
      if (this.ciclista.verificarChoque(this.vehiculos[i])) {
        this.vehiculos[i].reposicionar(this.carriles);
        this.procesarImpacto();
      }
    }

    // 5. Actualizar y dibujar ciclista
    this.ciclista.actualizar();

    // 6. Dibujar interfaz superior (HUD)
    this.dibujarHUD();
  }

  procesarImpacto() {
    this.ciclista.perderVida();

    if (this.ciclista.vidas <= 0) {
      this.estado = "PERDISTE";
    }
  }

  dibujarHUD() {
    push();
    // Panel izquierdo: Vidas
    fill(0, 0, 0, 190);
    stroke(80, 150, 240);
    strokeWeight(1.5);
    rect(15, 15, 150, 45, 8);

    noStroke();
    fill(255, 205, 0);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("VIDAS: " + "❤️ ".repeat(this.ciclista.vidas), 25, 37);

    // Panel derecho: Tiempo y progreso hacia la oficina
    fill(0, 0, 0, 190);
    stroke(80, 150, 240);
    rect(635, 15, 150, 45, 8);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text("META: " + this.tiempoRestante + "s", 710, 30);

    // Barra de progreso hacia la oficina
    let progreso = map(this.tiempoRestante, this.duracionPartida, 0, 0, 120);
    fill(60);
    rect(650, 42, 120, 8, 4);
    fill(0, 210, 120);
    rect(650, 42, progreso, 8, 4);
    pop();
  }

  // --- PANTALLAS DE INTERFAZ ---

  dibujarPantallaInicio() {
    if (imgPortada) {
      image(imgPortada, 0, 0, width, height);
    } else {
      background(18, 22, 32);
    }

    // Caja de título con estilo negro transparente de la Parte 1
    this.dibujarCajaPanel(100, 40, 600, 75);

    fill(255, 205, 0);
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("CAPÍTULO 2: CAMINO A LA OFICINA", width / 2, 62);

    fill(255);
    textSize(22);
    text("¡ES HORA DE PEDALEAR, QUERIDO!", width / 2, 92);

    this.dibujarBoton(260, 155, 280, 42, "JUGAR AHORA");
    this.dibujarBoton(260, 212, 280, 42, "INSTRUCCIONES");
    this.dibujarBoton(260, 269, 280, 42, "CRÉDITOS");
  }

  dibujarPantallaInstrucciones() {
    if (imgPortada) {
      image(imgPortada, 0, 0, width, height);
      fill(0, 200);
      rect(0, 0, width, height);
    } else {
      background(18, 22, 32);
    }

    this.dibujarCajaPanel(80, 30, 640, 340);

    fill(255, 205, 0);
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("INSTRUCCIONES", width / 2, 65);

    fill(240);
    textSize(14);
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    text("• Movete de izquierda a derecha con las flechas (← / →) o teclas A / D.", 130, 120);
    text("• Esquivá autos, repartidores y baches.", 130, 155);
    text("• Tenés 3 vidas.", 130, 190);
    text("• Sobreviví 30 segundos para llegar puntual a la oficina.", 130, 225);
    text("• Presioná la tecla R en cualquier momento para reiniciar.", 130, 260);

    this.dibujarBoton(300, 310, 200, 38, "VOLVER");
  }

  dibujarPantallaCreditos() {
    if (imgPortada) {
      image(imgPortada, 0, 0, width, height);
      fill(0, 200); // Oscurece la portada igual que en la Parte 1
      rect(0, 0, width, height);
    } else {
      background(18, 22, 32);
    }

    push();
    textAlign(CENTER, TOP);
    fill(255, 215, 0);
    textSize(18);
    textStyle(BOLD);
    text("CRÉDITOS Y AUTORÍA", width / 2, this.posicionYCreditos);

    textSize(14);
    textStyle(NORMAL);
    fill(240);
    text(
      "Continuación de la Obra Original:\n'¡Es Hora de Levantarse, Querido!'\n\nDiseño y Programación Orientada a Objetos:\nArian Imanoni (Legajo: 125600/9)\nIván Ledesma (Legajo: 94422/4)\n\nCátedra: PMIW - UNLP\nAño: 2026",
      width / 2,
      this.posicionYCreditos + 40
    );

    this.posicionYCreditos -= 0.8;
    if (this.posicionYCreditos < -210) {
      this.posicionYCreditos = height + 20;
    }
    pop();

    this.dibujarBoton(20, 342, 160, 38, "VOLVER");
  }

  dibujarPantallaFinal(gano) {
    if (imgPortada) {
      image(imgPortada, 0, 0, width, height);
      fill(0, 205);
      rect(0, 0, width, height);
    } else {
      background(18, 22, 32);
    }

    this.dibujarCajaPanel(80, 35, 640, 330);

    textAlign(CENTER, CENTER);
    if (gano) {
      fill(0, 220, 130);
      textSize(25);
      textStyle(BOLD);
      text("¡LLEGASTE A TIEMPO AL TRABAJO!", width / 2, 95);

      fill(240);
      textSize(14);
      textStyle(NORMAL);
      text("Tu jefe te felicita por tu puntualidad y tuviste un buen primer día.", width / 2, 165);
    } else {
      fill(255, 80, 80);
      textSize(25);
      textStyle(BOLD);
      text("¡CHOCASTE EN EL CAMINO!", width / 2, 95);

      fill(240);
      textSize(14);
      textStyle(NORMAL);
      text("Pediste ART el primer día, tu jefe no está contento.", width / 2, 165);
    }

    this.dibujarBoton(275, 235, 250, 40, "VOLVER A JUGAR");
    this.dibujarBoton(275, 290, 250, 40, "MENÚ PRINCIPAL");
  }

  dibujarCajaPanel(x_, y_, ancho_, alto_) {
    push();
    fill(0, 0, 0, 195);
    stroke(80, 150, 240);
    strokeWeight(2);
    rect(x_, y_, ancho_, alto_, 10);
    pop();
  }

  dibujarBoton(x_, y_, ancho_, alto_, texto_) {
    let mouseEncima = mouseX >= x_ && mouseX <= x_ + ancho_ && mouseY >= y_ && mouseY <= y_ + alto_;
    push();
    if (mouseEncima) {
      fill(220, 130, 20, 230);
      stroke(255, 255, 200);
      strokeWeight(2);
    } else {
      fill(0, 0, 0, 185);
      stroke(60, 120, 200);
      strokeWeight(1.5);
    }
    rect(x_, y_, ancho_, alto_, 8);

    noStroke();
    fill(255);
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(texto_, x_ + ancho_ / 2, y_ + alto_ / 2);
    pop();
  }

  manejarClic() {
    if (this.estado === "INICIO") {
      if (this.esClicEn(260, 155, 280, 42)) {
        this.iniciarPartida();
      } else if (this.esClicEn(260, 212, 280, 42)) {
        this.estado = "INSTRUCCIONES";
      } else if (this.esClicEn(260, 269, 280, 42)) {
        this.posicionYCreditos = height;
        this.estado = "CREDITOS";
      }
    } else if (this.estado === "INSTRUCCIONES") {
      if (this.esClicEn(300, 310, 200, 38)) this.estado = "INICIO";
    } else if (this.estado === "CREDITOS") {
      if (this.esClicEn(20, 342, 160, 38)) this.estado = "INICIO";
    } else if (this.estado === "GANASTE" || this.estado === "PERDISTE") {
      if (this.esClicEn(275, 235, 250, 40)) this.iniciarPartida();
      else if (this.esClicEn(275, 290, 250, 40)) this.estado = "INICIO";
    }
  }

  manejarTecla() {
    if (key === 'r' || key === 'R') {
      if (this.estado === "JUGANDO" || this.estado === "GANASTE" || this.estado === "PERDISTE") {
        this.iniciarPartida();
      }
    }
  }

  esClicEn(x_, y_, ancho_, alto_) {
    return mouseX >= x_ && mouseX <= x_ + ancho_ && mouseY >= y_ && mouseY <= y_ + alto_;
  }
}
