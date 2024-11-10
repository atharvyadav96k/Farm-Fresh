class profile {
    #userData;
    constructor() {
        this.getData();

    }
    async getData() {
        await fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                this.#userData = data[0];
                this.username();
                console.log(this.#userData)
            })
            .catch(error => {
                console.log(error);
            });
    }
    username() {
        const username = document.getElementById('username');
        const products = document.getElementById('products');
        username.innerHTML = this.#userData.username;
        let imageUrls = [];
        this.#userData.products.forEach((ele) => {
            imageUrls.push(ele.imageUrl)
            products.innerHTML += `<div class="col-lg-3 col-md-4 col-sm-6 mb-3">
            <div class="card cont bg-success-subtle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                <img  class="card-img-top image"  style='aspect-ratio: 3/2'>
                <div class="card-body">
                    <h5 class="card-title">${ele.productName}</h5>
                    <p class="card-text">${ele.productDescription}
                    </p>
                    <button type="button" class="btn  btn-success" style='width: 40%; margin: 5%;'>${ele.price}₹</button>
                    <button type="button" class="btn  btn-light deleteProduct" style='width: 40%'><svg style='color: red; margin: 5%;' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg></button>
                </div>
            </div>
        </div>`;
        })
        console.log(imageUrls)
        displayImages(imageUrls)
        this.deleteProducts();
    }
    deleteProducts() {
        let dp = Array.from(document.getElementsByClassName('deleteProduct'));
        dp.forEach((ele, index) => {
            ele.addEventListener('click', async () => {
                console.log(this.#userData.products[index]._id)
                await fetch(`deleteProduct?id=${this.#userData.products[index]._id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error('There was a problem with your fetch operation:', error);
                    });
            })
        })
    }
}
window.addEventListener('load', (event) => {
    const p = new profile();
})
function displayImages(data) {
    console.log()
    const images = Array.from(document.getElementsByClassName('image'));
    images.forEach((ele, index) => {
        ele.style.backgroundImage = `url(${data[index]})`
    })
}