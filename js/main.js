const imageSlider = document.querySelector("#slider").querySelector("img");
const flecheGauche = document.querySelector("#flechegauche");
const flecheDroite = document.querySelector("#flechedroite");

// Objet slider
const slider = {
  index: 0,
  image: [
    "images/slider1.jpg",
    "images/slider2.jpg",
    "images/slider3.jpg",
    "images/slider4.jpg",
    "images/slider5.jpg"
  ],

  suivant: function () {
    this.index++;
    if (this.index > this.image.length - 1) {
      this.index = 0;
    }
    imageSlider.setAttribute("src", this.image[this.index]);
  },

  precedent: function() {
    this.index--;
    if (this.index < 0) {
      this.index = this.image.length - 1;
    }
    imageSlider.setAttribute("src", this.image[this.index]);
  },

  clavier: function(e) {
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
};

// listener fleches et clavier
flecheDroite.addEventListener("click", () => {
  slider.suivant();
});

flecheGauche.addEventListener("click", () => {
  slider.precedent();
});

document.addEventListener("keydown", (e) => {
  slider.clavier(e);
});