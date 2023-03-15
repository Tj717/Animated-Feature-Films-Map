mapboxgl.accessToken =
'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk2NGYxMDJqbDNwcnB3Z251MWM5biJ9.gnv1COmlAfwp4ToaO-54Bg';

const film_list = ["My Neighbor Totoro", "Kiki's Delivery Service", "Spirited Away", "Grave of the Fireflies", "Barefoot Gen", "Akira", "Paprika", "Summer Wars", "Wolf Children", "Your Name"];

let map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/tj202222/clf4j1ule000s01sbvgpc1eua',
    zoom: 4.8, 
    center: [144, 37.5],
    minZoom: 4.8,
    projection: {
        name: 'mercator'
    },
});

map.on('zoomend', function() {
    var zoom = map.getZoom();
    if(zoom < 6){
        
    }
});


let slideIndex = 1;
let markers = [];
let marker;

async function addData(id) {
    // Load data from local file
    let response = await fetch(`assets/films/${id}.geojson`);
    let data = await response.json();
    map.addSource(`film${id}`, {
        type: 'geojson',
        data: data
    });
    return data;
}

function populateList() {
    for (let i = 1; i <= 10; i++) {
        addData(i)
        .then(data => {createBlocks(data, i)})
    }
}

function createBlocks(data, i) {
    let div = document.createElement("div");
    div.classList.add("film");

    div.innerHTML = `<img src="assets/posters/${i}.png" class="poster">
    <p class="movie_description">${data['properties']['description']}</p>`;

    div.addEventListener('click', () => {
        if (markers) {
            for (let marker of markers) marker.remove();
        }
        addPoints(data, i);
        if (data['properties']['real_location']) {
            if (data['properties']['center']) {
                map.flyTo({
                    center: data['properties']['center'],
                    zoom: data['properties']['zoom']
                });
            } else {
                map.fitBounds([
                    data['properties']['sw'], 
                    data['properties']['ne']
                ]);
            }
            // map.setStyle("mapbox://styles/mapbox/streets-v11");
        } else {
            alert("The following content contains spoilers. Please proceed with caution. Also, videos will contain sound.");
            map.flyTo({
                center: [144, 37.5],
                zoom: 4.8
            });
        }
    });
    const container3 = document.getElementById('container3');
    container3.appendChild(div);
}

function addPoints(data, i) {
    if (data['properties']['real_location']) {
        addMarkers(data, i);
    } else {
        showOverlay(data, i);
    }
}

function addMarkers(data, i) {
    for (const feature of data['features']) {
        // create a HTML element for each feature
        let el = document.createElement('div');
        el.className = 'marker';
        let currentFeatureType = feature.properties.type;
        el.className += ' ' + currentFeatureType;
        el.addEventListener('click', () => { 
            alert("The following content contains spoilers. Please proceed with caution. Also, videos will contain sound.");
            map.flyTo({center: feature.geometry.coordinates, zoom:15});
            setTimeout(() => {
                showOverlay(data, i);
            }, 2000);
        });
        // make a marker for each feature and add it to the map
        marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h2>${feature.properties.name}</h2><p>${feature.properties.description}</p>`
              )
          )
          .addTo(map);
        markers.push(marker);
    }
}

function showOverlay(data, i) {
    let overlay = document.getElementById('overlay');
    // var reader = new FileReader();
    let file = `../assets/overlay/${film_list[i-1]}.txt`;

    // https://www.w3schools.com/howto/howto_js_slideshow.asp

    let close_button = document.createElement('div');
    close_button.textContent = "Close";
    close_button.id = "close_button";
    close_button.addEventListener('click', () => {
        document.getElementById("overlay").style.display = "none";
    });

    readFile(file)
    .then((text) => {
        overlay.innerHTML = text;
        overlay.style.display = "block";
        overlay.appendChild(close_button);
        showSlides(slideIndex);
    })
}

async function readFile(file) {
    const response = await fetch(file)
    const text = await response.text()
    return text;
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

populateList();
