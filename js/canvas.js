class Canvas {

  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas.strokeStyle = '#000000';
    this.canvas.lineWidth = 1.5;
    this.canvas.lineCap = 'round';
    this.context = this.canvas.getContext("2d");
    this.lastPos = null;
    this.clear();
    this.initMouseEvents();
    this.initTouchEvents();
    this.initClearEvent();
  }

  initMouseEvents(){
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.buttons === 1) this.start(this.positionSouris(e));
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.stop(this.positionSouris(e));
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.move(this.positionSouris(e));
    });
    this.canvas.addEventListener("mouseleave", (e) => {
      this.stop(this.positionSouris(e));
    });
    this.canvas.addEventListener("mouseenter", (e) => {
      if (e.buttons === 1) this.start(this.positionSouris(e));
    });
  }

  initTouchEvents(){
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (e.touches.length > 0) this.start(this.positionToucher(e));
    });
    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (e.touches.length > 0) this.stop(this.positionToucher(e));
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length > 0) this.move(this.positionToucher(e));
    });
  }

  initClearEvent(){
    const bouttonClear = document.querySelector("#effacer");
    bouttonClear.addEventListener("click", this.clear.bind(this));
  }

  position(pos) {
    const rect = this.canvas.getBoundingClientRect(); //va chercher la position relative et la taille de l'élément par rapport à sa zone d'affichage
    pos.x = (pos.x - rect.left) / (rect.right - rect.left) * this.canvas.width; //récupère la position exacte de la souris en X
    pos.y = (pos.y - rect.top) / (rect.bottom - rect.top) * this.canvas.height; //idem en Y
    return pos;
  }

  positionSouris(e) {
    return this.position({
      x: e.clientX,
      y: e.clientY
    }); //récupère la position du clic dans le navigateur
  }

  positionToucher(e) {
    return this.position({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }); //récupère la position du premier toucher dans le navigateur
  }

  dessiner(pos1, pos2) {
    this.context.moveTo(pos1.x, pos1.y); //point de départ
    this.context.lineTo(pos2.x, pos2.y); //point d'arrivée
    this.context.stroke();
  }

  start(pos) {
    this.lastPos = pos; //prend la dernière pos connue
  }

  stop(pos) {
    if (this.lastPos) { //si lastpos n'est pas null, on dessine et on arrête pour finir le dessin
      this.dessiner(this.lastPos, pos);
      this.lastPos = null; //on a fini de dessiner, évite de lier le dernier tracé à un nouveau tracé
    }
  }

  move(pos) {
    if (this.lastPos) {
      const newPos = pos;
      this.dessiner(this.lastPos, newPos);
      this.lastPos = newPos; //relie la dernière pos avec la nouvelle pour signifier le mouvement
    }
  }

  clear() {
    this.canvas.width = this.canvas.width;
  }
}
