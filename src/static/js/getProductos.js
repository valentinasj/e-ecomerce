// TRAER LA DATA
fetch("http://localhost:3000/productos",{
    headers: {
        'Cache-Control': 'no-cache',
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
})
.then(data => data.json())
.then(data => mostrarData(data, false))
.catch(err => showMsm(err, "No se ha podido cargar los productos"))


// ESTOS ARRAYS LOS DEFINIMOS DENTRO DE LA FUNCION DE MOSTRAR DATA, EN LOS BOTONES DE LAS TAREJETAS

//favoritesArray guada los productos de favoritos que luego se enviaran al localStorage
let favoritesArray = [];
//cartProductsAdd guada los productos de carrito que luego se enviaran al localStorage
let cartProductsAdd = [];
// el finaData guarda la data del fetch, con la finalidad de globalizar los productos
let finalData;


// Muestra diferentes mensajes en la interfaz segun la accion, agregar o quitar a favortios o al carrito, o si existe o no el producto
function showMsm (err, msm){
    const msmDiv = document.querySelector(".msm")
    const p = document.querySelector(".p-msm")
    p.innerHTML = `<i class="ri-error-warning-line"></i> ${msm}`
    msmDiv.style.left = "15px";
    console.log(err)
    setTimeout(() => {
        msmDiv.style.left = "-400px";
    }, 2000);
}

// Contenedor de los objetos de la pantalla principal
let productosContainer = document.querySelector(".products-container")

// Funcion que se encarga de mostrar la informacion y de darle la funcionalidad a las tarjeta(enviar a fav, carrito, agregar o quitar)
// el parametro auth sirve para identificar de a donde vienen los datos,(fetch = false, productosFiltrados = true )
function mostrarData (data, auth) {
    if(auth){
        console.log("desactivar cambio de variable")
    }else{
        finalData = data
    }

    productosContainer.innerHTML = "";
    for(i = 0; i < data.length; i++){
        productosContainer.innerHTML += `
            <div class="product-card">
            <div class="product-card-img">
                <img src="${data[i].rutaImg}" alt="">
                <div class="product-controls">
                    <button><i class="ri-eye-line"></i></button>
                    <button><i class="ri-restart-line"></i></button>
                    <button type="submit" class="send-favorites"><i class="ri-heart-line"></i></button>
                    <input type="hidden" name="idProduct" value="${data[i].id}">
                    <input type="hidden" name="author" value="${data[i].autor}">
                    <input type="hidden" name="gramos" value="${data[i].gramosUnidades}">
                </div>
            </div>
            <div class="product-card-info">
                <p class="product-card-name">${data[i].title}</p>
                <div class="product-card-price">
                    <p class="first-price">$${data[i].precio}</p>
                    <p class="second-price">$${data[i].RealPrice}</p> </div>
                <div class="product-stars">
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-line"></i>
                    <p class="star-parraf">In Stock</p>
                </div>
                    <div class="add-product">
                    <button class="minus"><i class="ri-subtract-line"></i></button>
                    <p>Add</p>
                    <button class="add-cart"><i class="ri-add-line"></i></button>
                </div>
            </div>
        </div>
        `
    }

    // MOSTRAR LOS CONTROLES DE CADA PRODUCTO
    let imgButton = document.querySelectorAll(".product-card-img");
    let controls = document.querySelectorAll(".product-controls");

    imgButton.forEach(img => {
        img.addEventListener("click", ()=>{
            controls.forEach(control =>{
                control.style.visibility = "hidden";
                img.children[1].style.visibility = "visible";
            })
        })
    })

    // FUCIONALIDAD DEL BOTON DE FAVORITOS
    let sendButton = document.querySelectorAll(".send-favorites");
    sendButton.forEach(btn => {
        btn.addEventListener("click", ()=>{
            let padre = btn.parentNode.parentNode.parentNode;
            let sendId = padre.children[0].children[1].children[3].value;
            favoritesArray.push(sendId)
            localStorage.setItem("favProducts", JSON.stringify(favoritesArray))
            showMsm("Favoritos", "Se ha agregado a favoritos")
        })
    })

    // AGREGA EL PRODUCTO AL CARRITO O LE SUMA UNA UNIDAD A LA CANTIDAD
    const addButtons = document.querySelectorAll(".add-cart")
    addButtons.forEach(addBtn => {
        addBtn.addEventListener("click", ()=>{
            let papa = addBtn.parentNode.parentNode.parentNode
            const img = papa.children[0].children[0].src
            const idPost = papa.children[0].children[1].children[3].value
            const autor = papa.children[0].children[1].children[4].value
            const gramos = papa.children[0].children[1].children[5].value
            const titulo = papa.children[1].children[0].innerHTML
            const precio = papa.children[1].children[1].children[0].innerHTML
            const realPriceString = papa.children[1].children[1].children[1].innerHTML
            realPrice = parseFloat(realPriceString.slice(1))
            precioFinal = parseFloat(precio.slice(1))
            const cantidad = 1;
            const product = { id: idPost, cantidad, precioFinal, titulo, img, autor, gramos, realPrice, precioMult: precioFinal};
    
            let carrito = JSON.parse(localStorage.getItem('cartProducts')) || [];
    
            const ElProductoExiste = carrito.findIndex(item => item.id === idPost);
            if (ElProductoExiste !== -1) {
                carrito[ElProductoExiste].cantidad += 1;
                let precioMultiplicado = carrito[ElProductoExiste].cantidad * carrito[ElProductoExiste].precioFinal;
                carrito[ElProductoExiste].precioMult = parseFloat(precioMultiplicado.toFixed(2));
                actualizarCarrito()
            } else {
                carrito.push(product);
            }
            localStorage.setItem('cartProducts', JSON.stringify(carrito));
            showMsm("Carrito", "Se ha agregado a al carrito de compras")
            actualizarCarrito()
        })
    });

    // ELIMINA EL PRODUCTO DEL CARRITO O LE RESTA UNA UNIDAD A LA CANTIDAD
    const restButtons = document.querySelectorAll(".minus")
    restButtons.forEach(restBtn => {
        restBtn.addEventListener("click", () => {
            let papa = restBtn.parentNode.parentNode.parentNode
            const idPost = papa.children[0].children[1].children[3].value
            let carrito = JSON.parse(localStorage.getItem('cartProducts')) || []
            const ElProductoExiste = carrito.findIndex(item => item.id === idPost)
            if (ElProductoExiste !== -1) {
                if (carrito[ElProductoExiste].cantidad <= 1) {
                    carrito.splice(ElProductoExiste, 1)
                    localStorage.setItem("cartProducts", JSON.stringify(carrito))
                    showMsm("Carrito eliminado", "Se ha eliminado el producto del carrito")
                } else {
                    carrito[ElProductoExiste].cantidad -= 1
                    let precioMultiplicado = carrito[ElProductoExiste].cantidad * carrito[ElProductoExiste].precioFinal
                    carrito[ElProductoExiste].precioMult = parseFloat(precioMultiplicado.toFixed(2))
                    showMsm("Carrito", "Se ha quitado una unidad del carrito")
                }
            localStorage.setItem('cartProducts', JSON.stringify(carrito))
            actualizarCarrito()
                } else {
            showMsm("Carrito", "El producto no existe")
            }
        })
        })


    actualizarCarrito()
}

// ESTA FUNCION SE ENCARGA DE ACTUALIZAR LA INFORMACION EN EL CARRITO (PRODUCTOS, PRECIO, ETC)
function actualizarCarrito(){
    let carrito = JSON.parse(localStorage.getItem('cartProducts')) || [];
    let precios = [];
    let precioTotal;
    if (carrito !== -1) {

        const carritoContainer = document.querySelector(".cart-products")
        let priceContainer = document.querySelector(".price")
        let elementsLength = document.querySelector(".elements-lenght")
        priceContainer.innerHTML = "";
        carritoContainer.innerHTML = "";
        
        for(let i = 0; i < carrito.length; i++){
            const precio = carrito[i].precioMult;
            precios.push(precio)
            precioTotal = precios.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            });
            carritoContainer.innerHTML += `
                <div class="product-in-cart">
                    <div class="cart-img">
                        <img src="${carrito[i].img}" alt="">
                    </div>
                    <div class="cart-product-info">
                        <p class="in-cart-name">${carrito[i].titulo}</p>
                        <p class="in-cart-amount-price">${carrito[i].cantidad} x $${carrito[i].precioFinal}</p>
                    </div>
                </div>
            `;

        }
        if(precioTotal == undefined){
            priceContainer.innerHTML += `$0`;
            localStorage.setItem("precio", JSON.stringify(0))
        }else{
            localStorage.setItem("precio", JSON.stringify(precioTotal.toFixed(2)))
            priceContainer.innerHTML += `$${parseFloat(precioTotal.toFixed(2))}`;
        }
        elementsLength.innerHTML = carrito.length;
    } else {
        carrito.push(product);
    }
}



// ESTOS BOTONES SE ENCARGARN DE FILTRAN LOS PRODUCTOS POR CATEGORIA SEGUN SU ID
const vegBtn = document.querySelector(".veg")
vegBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 1)
    mostrarData(productoFiltadro, true)
})

const beveBtn = document.querySelector(".beve")
beveBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 2)
    mostrarData(productoFiltadro, true)
})

const meatsBtn = document.querySelector(".meats")
meatsBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 3)
    mostrarData(productoFiltadro, true)
})

const breakBtn = document.querySelector(".break")
breakBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 4)
    mostrarData(productoFiltadro, true)
})

const frozenBtn = document.querySelector(".frozen")
frozenBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 5)
    mostrarData(productoFiltadro, true)
})

const bisBtn = document.querySelector(".bis")
bisBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 6)
    mostrarData(productoFiltadro, true)
})

const groceryBtn = document.querySelector(".grocery")
groceryBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 7)
    mostrarData(productoFiltadro, true)
})

const winesBtn = document.querySelector(".wines")
winesBtn.addEventListener("click", ()=>{
    const productoFiltadro = finalData.filter(({ categoriaId }) => categoriaId == 8)
    mostrarData(productoFiltadro, true)
})


// SUBIR PAGINA
const upBtn = document.querySelector(".up")
upBtn.addEventListener("click", ()=>{
    document.documentElement.scrollTop = 0;
})



// CONTADOR
const $days = document.querySelector('.days'),
$hours = document.querySelector('.hours'),
$minutes = document.querySelector('.minutes'),
$seconds = document.querySelector('.seconds')

//Fecha a futuro
const countdownDate = new Date('12 25, 2023 10:28:00').getTime();

let interval = setInterval(function(){
    //Obtener fecha actual y milisegundos
    const now = new Date().getTime();

    //Obtener las distancias entre ambas fechas
    let distance = countdownDate - now;

    //Calculos a dias-horas-minutos-segundos
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24 )) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60 )) / (1000));

    //Escribimos resultados
    $days.innerHTML = `${days}:`;
    $hours.innerHTML = `${hours}:`;
    $minutes.innerHTML = `${minutes}:`;
    $seconds.innerHTML = ('0' + seconds).slice(-2);

}, 1000);