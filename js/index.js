mapboxgl.accessToken =
'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk2NGYxMDJqbDNwcnB3Z251MWM5biJ9.gnv1COmlAfwp4ToaO-54Bg';

let map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/tj202222/clf4j1ule000s01sbvgpc1eua',
    zoom: 4.8, 
    center: [144, 37.5],
    projection: {
        name: 'albers',
        center: [140, 37],
        parallels:  [140, 37]
    }
});

let layer_prev;
let layer_curr;

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
    // let length = Object.keys(data['features']).length;
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
        layer_curr = `film${i}`
        if (layer_prev != "") map.removeLayer(`film${layer_prev}_points`);
        layer_prev = layer_curr;
        addPoints(i);
    });
    const container3 = document.getElementById('container3');
    container3.appendChild(div);
}

function filterJson (data, keyWord) {
    let output = {
        "type": "FeatureCollection",
        "features": []
    };
    length = Object.keys(data['features']).length;
    for (i = 0; i < length; i++) {
        // print(data['features'][i]['properties'])
        if (data['features'][i]['properties'][searchField].includes(searchVal)){
            output['features'].push(data['features'][i])
        }
    }
    // console.log(output);
    return output
}

function addPoints(id) {
    map.addLayer({
        'id': `film${id}_points`,
        'type': 'symbol',
        'source': `film${id}`,
        'layout': {
            'icon-image': 'custom-marker',
            'text-field': ['get', 'name'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
        }
    });
}

populateList();
