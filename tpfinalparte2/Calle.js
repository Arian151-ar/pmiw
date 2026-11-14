// =====================================================
// CLASE 2: CALLE (Desplazamiento infinito de calle.png)
// =====================================================
class Calle {
  constructor() {
    this.desplazamientoY = 0;
    this.velocidad = 4;
  }

  actualizar() {
    this.mover();
    this.dibujar();
  }

  mover() {
    this.desplazamientoY += this.velocidad;
    if (this.desplazamientoY >= height) {
      this.desplazamientoY = 0;
    }
  }

  dibujar() {
    if (imgCalle) {
      image(imgCalle, 0, this.desplazamientoY, width, height);
      image(imgCalle, 0, this.desplazamientoY - height, width, height);
    } else {
      background(48, 52, 58);
    }
  }
}
