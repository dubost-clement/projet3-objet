class App {
  constructor() {
    this.initMap();
    this.loadApi();
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

  //---------- Récupération donnée stations -----------
  //---------------------------------------------------
  loadApi() {
    $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=00725f1585ae004d2043b59894843d43b6650b8e").then(api => {
      this.api = api;
      this.initMarkers();
    });
  }

  //---------- initialisation des markers -----------
  //---------------------------------------------------
  initMarkers() {
    let markers = [];
    for (let i = 0; i < this.api.length; i++) {
      let station = this.api[i];
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
    this.markerCluster = new MarkerClusterer(veloStation.map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
  }

  //---------- Block informations station -----------
  //---------------------------------------------------
  infoStation(station) {
    this.station = station;
    google.maps.event.addListener(this.marker,"click", () => {
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
    });
  }
}

addEventListener("load", () => {
  veloStation = new App();
  console.log(veloStation);
});
