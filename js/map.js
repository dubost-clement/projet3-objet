class Map {
  constructor(timer) {
    this.initMap();
    this.loadApi();
    this.initReservationListener();
    this.canvas = new Canvas();
    this.timer = timer;
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
        map: this.map,
        title: station.address,
        icon: iconMarker
      });
      markers = markers.concat(this.marker);
      this.infoStation(station);
    }
    new MarkerClusterer(this.map, markers, {
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
      this.canvas.clear();
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

    //---------- Block timer réservation -----------
    //---------------------------------------------------

    buttonConfirm.addEventListener("click", () => {
        this.timer.start(this.station.address, 1200);
        reservation.style.display = "none";
        sectionTimer.scrollIntoView();
    });
  }

}
