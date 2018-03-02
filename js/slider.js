class Slider {
  constructor() {
    this.imageSlider = document.querySelector("#slider").querySelector("img");
    this.flecheGauche = document.querySelector("#flechegauche");
    this.flecheDroite = document.querySelector("#flechedroite");
    this.index = 0;
    this.image = [
      "images/slider1.jpg",
      "images/slider2.jpg",
      "images/slider3.jpg",
      "images/slider4.jpg",
      "images/slider5.jpg"
    ];
    this.listener();
  }

  suivant() {
    this.index++;
    if (this.index > this.image.length - 1) {
      this.index = 0;
    }
    this.imageSlider.setAttribute("src", this.image[this.index]);
  }

  precedent() {
    this.index--;
    if (this.index < 0) {
      this.index = this.image.length - 1;
    }
    this.imageSlider.setAttribute("src", this.image[this.index]);
  }

  clavier(e) {
    const code = e.keyCode;
    switch (code) {
      case 39:
        this.suivant();
        break;
      case 37:
        this.precedent();
        break;
    }
  }

  listener() {
    this.flecheDroite.addEventListener("click", () => {
      this.suivant();
    });

    this.flecheGauche.addEventListener("click", () => {
      this.precedent();
    });

    document.addEventListener("keydown", e => {
      this.clavier(e);
    });
  }
}
