class App {
  constructor() {
    this.initMap();
    this.loadApi();
    this.initReservationListener();
  }

  //---------- Initialisation google map -----------
  //------------------------------------------------
  initMap() {
    this.map = new google.maps.Map(document.querySelector("#map"), {
      center: {
        lat: 45.7616,
        lng: 4.8559
      },
      zoom: 13
    });
  }

  //---------- Récupération données stations -----------
  //---------------------------------------------------
  loadApi() {
    $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=00725f1585ae004d2043b59894843d43b6650b8e")
      .then( (api) => {
        this.api = api;
        this.initMarkers();
      })
    ;
  }

  //---------- initialisation des markers -----------
  //---------------------------------------------------
  initMarkers() {
    let markers = [];
    for (let i = 0; i < this.api.length; i++) {
      const station = this.api[i];
      const iconMarker = {
        url: "js/images/marker-green.png",
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 20)
      };

      if (station.available_bikes === 0) {
        iconMarker.url = "js/images/marker-orange.png";
      } else if (station.status === "CLOSE") {
        iconMarker.url = "js/images/marker-red.png";
      }

      this.marker = new google.maps.Marker({
        position: station.position,
        map: veloStation.map,
        title: station.address,
        icon: iconMarker
      });
      markers = markers.concat(this.marker);
      this.infoStation(station);
    }
    new MarkerClusterer(veloStation.map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
  }

  //---------- Block informations station -----------
  //---------------------------------------------------
  infoStation(station) {
    google.maps.event.addListener(this.marker, "click", () => {
      this.station = station;
      const reservation = document.querySelector("#reservation");
      const reserver = document.querySelector("#reserver");
      const confirmation = document.querySelector("#confirmation");
      const infos = document.querySelector("#informations");

      reservation.style.display = "block";
      reserver.style.display = "block";
      confirmation.style.display = "none";
      reservation.scrollIntoView();

      if (station.status === "OPEN") {
        station.status = "OUVERTE";
      } else if (station.status === "CLOSE") {
        station.status = "FERMÉE";
      }

      infos.innerHTML = `
          <p>Adresse : <span>${station.address}</span><p>
          <p>État de la station: <span>${station.status}</span></p>
          <p>Vélos disponibles: <span>${station.available_bikes}</span></p>
          <p>Places disponibles: <span>${station.available_bike_stands}</span></p>
        `;
    })
    ;
  }

  //---------- block réserveration -----------
  //---------------------------------------------------
  initReservationListener(){
    const buttonReserver = document.querySelector("#button-reservation").querySelector("button");
    buttonReserver.addEventListener("click", () => {
      if (this.station.available_bikes > 0) {
        confirmation.style.display = "block";
        reserver.style.display = "none";
        this.confirmation();
      }
      else {
        confirmation.style.display = "none";
        reservation.style.display = "block";
        alert("aucun vélo n'est disponible dans cette station");
      }
    })
  }

  //---------- Block réservation station -----------
  //---------------------------------------------------
  confirmation() {
    const buttonConfirm = document.querySelector("#valider");
    const sectionTimer = document.querySelector("#timer");
    const textTimer = document.querySelector("#time");
    let intervalID = 0;
    let time;
    let stationAddress = this.station.address;

    //---------- Block timer réservation -----------
    //---------------------------------------------------
    buttonConfirm.addEventListener("click", () => {
      clearInterval(intervalID);
      reservation.style.display = "none";
      time = 1200;
      sectionTimer.scrollIntoView();
      
      intervalID = setInterval (() => {
        sectionTimer.style.display = "block";
        sessionStorage.setItem("station", stationAddress);
        sessionStorage.setItem("timer", time);
        const {minutes,seconds} = getMinutesAndSeconds(time);
        textTimer.innerHTML =
          `Vous avez bien réservé un vélo à <span>${stationAddress}</span> pour une durée de <span>${minutes}:${seconds}</span>`
        time = time - 1;
        if (time === 0) {
          clearInterval(intervalID);
          textTimer.innerHTML =
            `Votre réservation à la station <span>${stationAddress}</span> a expiré !`
          sessionStorage.clear("station", "timer");
        }
      }, 1000)
    });
  }

}

const getMinutesAndSeconds = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return {
    minutes,
    seconds
  };
}


// --------------- Canvas signature ---------------
// ------------------------------------------------------------ 
  const Sign = {
  
    //signature
    canvas: document.getElementById("canvas"),
    context: this.canvas.getContext("2d"),
  
    //dernière position non définie pour l'instant
    lastPos: null,
  
    position: function (pos) {
      var rect = Sign.canvas.getBoundingClientRect(); //va chercher la position relative et la taille de l'élément par rapport à sa zone d'affichage
      pos.x = (pos.x - rect.left) / (rect.right - rect.left) * Sign.canvas.width; //récupère la position exacte de la souris en X
      pos.y = (pos.y - rect.top) / (rect.bottom - rect.top) * Sign.canvas.height; //idem en Y
      return pos;
    },
  
    positionSouris: function (e) {
      return Sign.position({
        x: e.clientX,
        y: e.clientY
      }); //récupère la position du clic dans le navigateur
    },
  
    positionToucher: function (e) {
      return Sign.position({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }); //récupère la position du premier toucher dans le navigateur
    },
  
    dessiner: function (pos1, pos2) {
      Sign.context.moveTo(pos1.x, pos1.y); //point de départ
      Sign.context.lineTo(pos2.x, pos2.y); //point d'arrivée
      Sign.context.stroke();
    },
  
    start: function (pos) {
      Sign.lastPos = pos; //prend la dernière pos connue
    },
  
    stop: function (pos) {
      if (Sign.lastPos) { //si lastpos n'est pas null, on dessine et on arrête pour finir le dessin
        Sign.dessiner(Sign.lastPos, pos);
        Sign.lastPos = null; //on a fini de dessiner, évite de lier le dernier tracé à un nouveau tracé
      }
    },
  
    move: function (pos) {
      if (Sign.lastPos) {
        var newPos = pos;
        Sign.dessiner(Sign.lastPos, newPos);
        Sign.lastPos = newPos; //relie la dernière pos avec la nouvelle pour signifier le mouvement
      }
    },
  
    clear: function () {
      Sign.canvas.width = Sign.canvas.width;
    }
  };

  Sign.context.strokeStyle = "#000000";
  Sign.context.lineWidth = 1.5;
  Sign.context.lineCap = "round";
  
  //effacer canvas
  const bouttonClear = document.querySelector("#effacer");
  bouttonClear.addEventListener("click", Sign.clear);
  
  // --------------- Mouse events ---------------
  Sign.canvas.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) Sign.start(Sign.positionSouris(e));
  });
  Sign.canvas.addEventListener("mouseup", (e) => {
    Sign.stop(Sign.positionSouris(e));
  });
  Sign.canvas.addEventListener("mousemove", (e) => {
    Sign.move(Sign.positionSouris(e));
  });
  Sign.canvas.addEventListener("mouseleave", (e) => {
    Sign.stop(Sign.positionSouris(e));
  });
  Sign.canvas.addEventListener("mouseenter", (e) => {
    if (e.buttons === 1) Sign.start(Sign.positionSouris(e));
  });
  
  // --------------- Touch events ---------------
  Sign.canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (e.touches.length > 0) Sign.start(Sign.positionToucher(e));
  });
  Sign.canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (e.touches.length > 0) Sign.stop(Sign.positionToucher(e));
  });
  Sign.canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length > 0) Sign.move(Sign.positionToucher(e));
  });





addEventListener("load", () => {
  veloStation = new App();
  console.log(veloStation);
})
;
