// ===============================================
// CLASE 5: BACHE (Obstáculos fijos en el asfalto)
// ===============================================
class Bache {
  constructor(x_, y_) {
    this.x = x_;
    this.y = y_;
    this.ancho = 52;
    this.alto = 42;
    this.velocidad = 4;
  }

  actualizar(listaCarriles_) {
    this.mover(listaCarriles_);
    this.dibujar();
  }

  mover(listaCarriles_) {
    this.y += this.velocidad;

    if (this.y - this.alto / 2 > height) {
      this.reposicionar(listaCarriles_);
    }
  }

  reposicionar(listaCarriles_) {
    this.y = random(-120, -380);
    this.x = random(listaCarriles_);
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    if (imgBache) {
      image(imgBache, 0, 0, this.ancho, this.alto);
    }
    pop();
  }
}
