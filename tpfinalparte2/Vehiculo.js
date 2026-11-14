// ===========================================================
// CLASE 4: VEHICULO (Autos de colores y Motos de repartidor)
// ===========================================================
class Vehiculo {
  constructor(x_, y_, tipo_) {
    this.x = x_;
    this.y = y_;
    this.tipo = tipo_; // "auto" o "moto"

    if (this.tipo === "auto") {
      this.ancho = 54;
      this.alto = 96;
      this.velocidad = random(2, 3.5);
      this.img = random(imgsAutos);
    } else {
      this.ancho = 40;
      this.alto = 74;
      this.velocidad = random(4.5, 5.5);
      this.img = imgRepartidor;
    }
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
    this.y = random(-100, -320);
    this.x = random(listaCarriles_);
    if (this.tipo === "auto") {
      this.img = random(imgsAutos);
    }
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    if (this.img) {
      image(this.img, 0, 0, this.ancho, this.alto);
    }
    pop();
  }
}
