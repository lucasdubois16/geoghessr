let position = getRandomPosition();
let guessMarker;
let answerMarker;
let guessLatLng;
let guessed = false; 
let targetSet = false;
let totalScore = 0 ;
let map;
let line;  

let rounds = parseInt(localStorage.getItem("manches")) || 5;
let timePerRound = parseInt(localStorage.getItem("time")) || 30;

let currentRound = 1;
let timer;
let timeLeft;
let minutes;
let secondes;

let points;

function newRound() {
    position = getRandomPosition();

    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }
    if (line) {
        map.removeLayer(line);
        line = null;
    }
    if (answerMarker) {
        map.removeLayer(answerMarker);
        answerMarker = null;
    }

    guessLatLng = null;
    guessed = false;
    targetSet = false;

    // éventuellement : recadrer la carte sur Armentières
    map.setView([50.685, 2.882], 14);

    // relancer Street View sur la nouvelle position
    initStreetView();
}

function startRound(){
    document.getElementById("round-info").innerText = "Manche " + currentRound + "/"+ rounds;
    timeLeft = timePerRound;
    timer = setInterval(() => {
        minutes = Math.floor(timeLeft / 60);
        secondes = timeLeft%60
        if (secondes < 10) secondes = "0" + secondes;
        document.getElementById("timer").innerText = minutes+":"+secondes
        timeLeft--;
        if(timeLeft < 0){
            endRound(points)
        }
    }, 1000);

}

function endRound(points){
    clearInterval(timer);
    if(currentRound >= rounds){
        document.getElementById("end-text").innerHTML = totalScore+" Points !";
        document.getElementById("end-popup").classList.remove("hidden");
    }else{
        currentRound++;
        newRound();
        startRound()
    }
}

function initStreetView() {
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
        position: position,
        pov: {heading:0, pitch:0},
        zoom: 1
    }
  );
    panorama.addListener("position_changed", () => {
        if (!targetSet){
            targetSet = true;
            const realPos = panorama.getPosition();
            console.log("Position set : ", realPos.lat(), realPos.lng());

            // Met à jour la variable "target"
            position = {
                lat: realPos.lat(),
                lng: realPos.lng()
            };
        }
      
  });
}
function getRandomPosition(){
    const position = {
        lat : 50.680 + Math.random() * 0.015,
        lng: 2.870 + Math.random() * 0.025
    };
    return position;
}
let marker;
document.addEventListener("DOMContentLoaded", function() {

    map = L.map('map').setView([50.685, 2.882], 14);
    L.tileLayer('https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e){
        if (guessed){
            return;
        }
        console.log("clic détecté !", e.latlng); // test
        if (!guessMarker){
            guessMarker = L.marker(e.latlng).addTo(map);
        }else{
            guessMarker.setLatLng(e.latlng);
        };
        guessLatLng = e.latlng;
    });

    document.getElementById("valider").addEventListener("click", function(){
    if (!guessLatLng){
        alert("Pas de marqueur enregistré !");
        return;
    }
    guessed = true
    const distance = map.distance(guessLatLng, position);
    console.log("Distance au point cible : ", Math.round(distance), "m");
    answerMarker = L.marker(position, {
        icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [25, 41]  
        })
    });
    answerMarker.addTo(map);
    map.fitBounds([
        [guessLatLng.lat, guessLatLng.lng],
        [position.lat, position.lng]
    ])
    line = L.polyline([guessLatLng, position],{color:'orange'}).addTo(map);
    points = calculatePoints(distance);
    totalScore += points; 
    document.getElementById("score").innerText = totalScore + " p";
    document.getElementById("result-text").innerHTML = `${points} points !<br>Distance : ${Math.round(distance)} m`;
    clearInterval(timer);
    document.getElementById("result-popup").classList.remove("hidden");
    })

    // gestion du clic sur le bouton "continuer" du popup de fin de manche 
    document.getElementById("continue").addEventListener("click", function() {
        document.getElementById("result-popup").classList.add("hidden");
        endRound(points);

    //gestion de la taille de l'overlay de la carte 
    document.getElementById("map").addEventListener("mouseenter", function(){
        console.log("coucou")
        document.getElementById("map").classList.add("map-big")
    })
    document.getElementById("map").addEventListener("mouseleave", function(){
        document.getElementById("map").classList.remove("map-big")
    })
});
 startRound()
});

function calculatePoints(distance) {
    if(distance <= 50) return 5000;
    return Math.max(0, Math.round(5000 - (distance - 50) * 10));
}

document.getElementById("end-btn").addEventListener("click", function(){
    window.location.href = "geoghessr/index.html";
})
