// =============================
// CLASE 3: CICLISTA (Jugador)
// =============================
class Ciclista {
  constructor(x_, y_) {
    this.x = x_;
    this.y = y_;
    this.ancho = 38;
    this.alto = 70;
    this.velocidad = 2;
    this.vidas = 2;
  }

  reiniciar(x_, y_) {
    this.x = x_;
    this.y = y_;
    this.vidas = 3;
  }

  actualizar() {
    this.mover();
    this.dibujar();
  }

  mover() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.velocidad;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.velocidad;
    }

    // Limita el movimiento dentro de los bordes del asfalto
    this.x = constrain(this.x, 220, 580);
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    if (imgCiclista) {
      image(imgCiclista, 0, 0, this.ancho, this.alto);
    }
    pop();
  }

  verificarChoque(obstaculo_) {
    let distanciaX = abs(this.x - obstaculo_.x);
    let distanciaY = abs(this.y - obstaculo_.y);

    // Hitbox ajustada para que los roces laterales no sean injustos
    let choqueX = distanciaX < (this.ancho + obstaculo_.ancho) * 0.36;
    let choqueY = distanciaY < (this.alto + obstaculo_.alto) * 0.36;

    return choqueX && choqueY;
  }

  perderVida() {
    this.vidas--;
  }
}
