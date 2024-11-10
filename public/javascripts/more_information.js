const lo = document.getElementById('location');

navigator.geolocation.getCurrentPosition(
    (position) => {
        // console.log(position);
        lo.value = `${position.coords.latitude},${position.coords.longitude}`
        // console.log(position.latitude, position.longitude);
        document.getElementById('filter').disabled = false;
        nearbyme(position.coords.latitude, position.coords.longitude);
        document.getElementById('search').addEventListener('click', function () {
            getData();
        })
    },
    (error) => {
        console.error(error.message);
    }
);
async function getData() {
    const data = {
        filter: document.getElementById('filter').value,
        location: document.getElementById('location').value
    };
    document.getElementById('filter').value = ''
    await fetch('/search', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let imageUrls = [];
            console.log('Response:', data);
            document.getElementById("main").innerHTML = '';
            if (data.length > 0) {
                data.forEach((ele) => {
                    imageUrls.push(ele.imageUrl);
                    document.getElementById("main").innerHTML += `<div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card cont bg-success-subtle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <img  class="card-img-top image"  style='aspect-ratio: 3/2'>
                        <div class="card-body">
                            <h5 class="card-title">${ele.productName}</h5>
                            <p class="card-text">${ele.productDescription}
                            </p>
                            <button type="button" class="btn  btn-success" style='width: 100%'>${ele.price}₹</button>
                        </div>
                    </div>
                </div>`;

                    more_info(data);
                    // console.log(ele)

                })
                console.log(imageUrls);
                displayImages(imageUrls)
                more_info(data);
            }
            else {
                document.getElementById("main").innerHTML = `<h1 class='text-center text-success'>Sorry No Result Found 🥲. In your area 🗺️.</h1>`
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function displayImages(data) {
    // console.log()
    const images = Array.from(document.getElementsByClassName('image'));
    images.forEach((ele, index) => {
        ele.style.backgroundImage = `url(${data[index]})`
    })
}
function more_info(data) {
    console.log(data)
    const results = Array.from(document.getElementsByClassName('cont'));
    results.forEach((ele, index) => {
        ele.addEventListener('click', () => {
            displayMoreInfo(data[index]);
        });
    });
    
}
var map = null;
var marker = null;
function displayMoreInfo(data) {
    console.log(data);
    document.getElementById("pImage").style.backgroundImage = `url(${data.imageUrl})`;
    document.getElementById('pName').innerText = data.productName;
    document.getElementById('pDescription').innerHTML = productDataDisplay(data);
    console.log(data.imageUrl);
    if (!map) {
        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
    if (marker) {
        map.removeLayer(marker);
    }
    console.log(data.location.coordinates)
    marker = L.marker([data.location.coordinates[0], data.location.coordinates[1]]).addTo(map);
    marker.bindPopup(`<b>${data.productName}</b>`).openPopup();
    document.getElementById('openGmap').addEventListener('click', ()=>{
        openDestinationInGoogleMaps(data.location.coordinates[0], data.location.coordinates[1]);
    })
}
function openDestinationInGoogleMaps(lat, lon) {
    var latitude = lat; 
    var longitude = lon; 
    var mapsUrl = "https://www.google.com/maps?q=" + latitude + "," + longitude;
    window.open(mapsUrl, '_blank');
}
function getNear(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            nearbyme(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
            console.error(error.message);
        }
    );
}
async function nearbyme(lati, long) {
    const data = {
        latitude: lati,
        longitude: long
    };

    await fetch('/nearbyme', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the JSON response data here
            let imageUrls = [];
            // console.log('Response:', data);
            document.getElementById("main").innerHTML = '';
            if (data.length > 0) {
                data.forEach((ele) => {
                    imageUrls.push(ele.imageUrl);
                    document.getElementById("main").innerHTML += `<div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card cont bg-success-subtle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <img  class="card-img-top image"  style='aspect-ratio: 3/2'>
                        <div class="card-body">
                            <h5 class="card-title">${ele.productName}</h5>
                            <p class="card-text">${ele.productDescription}
                            </p>
                            <button type="button" class="btn  btn-success" style='width: 100%'>${ele.price}₹</button>
                        </div>
                    </div>
                </div>`

                    more_info(data);
                    // console.log(ele)
                    more_info(data);

                })
                // console.log(imageUrls);
                displayImages(imageUrls)
            }
            else {
                document.getElementById("main").innerHTML = `<h1 class='text-success text-center'>Sorry No Result Found 🥲. In your area 🗺️.</h1>`
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function productDataDisplay(data) {
    let str = `<p>${data.productDescription}</p><p>`;
    data.address.forEach((ele) => {
        str += (ele + ' ');
    })
    str += '</p>'
    return str;
}