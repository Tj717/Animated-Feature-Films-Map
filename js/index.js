mapboxgl.accessToken =
'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk2NGYxMDJqbDNwcnB3Z251MWM5biJ9.gnv1COmlAfwp4ToaO-54Bg';

let map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/tj202222/clf4j1ule000s01sbvgpc1eua',
    zoom: 4.8, 
    center: [140, 37],
    projection: {
        name: 'albers',
        center: [140, 37],
        parallels:  [140, 37]
    }
});

let layer_prev;
let layer_curr;

async function addData() {
    // Load data from local file
    let response = await fetch(`assets/data.geojson`);
    let data = await response.json();
    map.on('load', () => { 
        map.addSource('films', {
            type: 'geojson',
            data: data
        });

        const container3 = document.getElementById('container3');
        let length = Object.keys(data['features']).length;
        for (i = 0; i < length; i++) {
            let item = data['features'][i];
            let div = document.createElement("div");
            let description = document.createElement("h3");
            div.innerHTML = `<div class="film">
            <img src="assets/posters/${i}.png" class="poster">
            <h3>${data['features'][i]['properties']['name']}</h3>
        </div>`;
            div.addEventListener('click', () => {
                layer_curr = `film${i}`
                if (layer_prev != "") map.removeLayer(`film${layer_prev}_points`);
                layer_prev = layer_curr;
                addSource(i);
                addPoints(i);
            });
            container3.appendChild(div);
        }
    });
}

function filterJson (data, keyWord) {
    let output = {
        "type": "FeatureCollection",
        "features": []
    };
    searchField = "CrimeAgainstCategory";
    searchVal = keyWord;
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
function addSource(layer) {
    map.addSource(`film${layer}_source`, {
        'type': 'geojson',
        'data': `film${layer}.geojson`
    });
};

function addPoints(layer) {
    map.addLayer({
        'id': `film${layer}_points`,
        'type': 'symbol',
        'source': `film${layer}_source`,
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
