// ESTA FUNCION SE ENCARGA DE MOSTRAR LOS PRODUCTOS DEL CARRITO EN EL BODY Y SE ENCARGAR DE ACTUALIZAR LA INFORMACION CUANDO HAY UN CAMBIO
function mostrarEnElCarro (){
    // Guardamos los id de los productos en el favoritesArray para luego enviarlos al localStorage
    let favoritesArray = [];
    let carrito = JSON.parse(localStorage.getItem('cartProducts')) || 0;
    let savePrices = []
    if (carrito !== -1) {

        const carritoContainer = document.querySelector(".cart-body-products")
        carritoContainer.innerHTML = "";

        if(carrito == 0){
            carritoContainer.innerHTML += `<p class="min-p center"><i class="ri-emotion-sad-line"></i> No hay productos para comprar</p>`;

        }else{

            for(let i = 0; i < carrito.length; i++){
                savePrices.push(carrito[i].realPrice - carrito[i].precioFinal)
                carritoContainer.innerHTML += `
                <div class="cart-product">
                    <img src="${carrito[i].img}" alt="">
                    <div class="product-info">
                        <p class="cart-title">${carrito[i].titulo}</p>
                        <p class="sold-by"><strong>Sold By:</strong> ${carrito[i].autor}</p>
                        <p class="quantity"><strong>Quantity:</strong> -${carrito[i].gramos}</p>
                    </div>
                    <div class="cart-card-price">
                        <p class="min-p">Price</p>
                        <div class="prices">
                            <p class="prince">$${carrito[i].precioFinal}</p>
                            <p class="discount-price">$${carrito[i].realPrice}</p>
                        </div>
                        <p class="save-price">You save: <strong>$${savePrices[i].toFixed(2)}</strong></p>
                    </div>
                    <div class="quantity-btn">
                        <p class="min-p">Qty</p>
                        <div class="btn-group">
                            <button class="minus"><i class="ri-subtract-line"></i></button>
                            <p class="quantity">${carrito[i].cantidad}</p>
                            <button class="add-cart"><i class="ri-add-line"></i></button>
                        </div>
                    </div>
                    <div class="total-price-cart">
                        <p class="min-p">Total</p>
                        <p class="totalPrice">$${carrito[i].precioMult}</p>
                    </div>
                    <div class="actions">
                        <p class="min-p">Action</p>
                        <button class="save-for-later">Save for later</button>
                        <button class="Remove">Remove</button>
                    </div>
                    <input type="hidden" name="idProduct" value="${parseFloat(carrito[i].id)}">
                </div>
                `;
    
            }

        }
        
            // AGREGA EL PRODUCTO AL CARRITO O LE SUMA UNA UNIDAD A LA CANTIDAD
            const addButtons = document.querySelectorAll(".add-cart")
            addButtons.forEach(addBtn => {
                addBtn.addEventListener("click", ()=>{
                    let papa = addBtn.parentNode.parentNode.parentNode
                    const idPost = papa.children[6].value
                    let carrito = JSON.parse(localStorage.getItem('cartProducts')) || [];
            
                    const ElProductoExiste = carrito.findIndex(item => item.id === idPost);
                    if (ElProductoExiste !== -1) {
                        carrito[ElProductoExiste].cantidad += 1;
                        let precioMultiplicado = carrito[ElProductoExiste].cantidad * carrito[ElProductoExiste].precioFinal;
                        carrito[ElProductoExiste].precioMult = parseFloat(precioMultiplicado.toFixed(2));
                        actualizarCarrito()
                        actualizarPayBody(carrito)
                    } else {
                        showMsm("carrito", "El producto no existe")
                    }
                    localStorage.setItem('cartProducts', JSON.stringify(carrito));
                    showMsm("Carrito", "Se ha agregado a al carrito de compras")
                    mostrarEnElCarro()
                    actualizarCarrito()
                    actualizarPayBody(carrito)
                })
            });

            // ELIMINA EL PRODUCTO DEL CARRITO O LE RESTA UNA UNIDAD A LA CANTIDAD
            const restButtons = document.querySelectorAll(".minus")
            restButtons.forEach(restBtn => {
                restBtn.addEventListener("click", () => {
                        let papa = restBtn.parentNode.parentNode.parentNode
                        const idPost = papa.children[6].value
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
                                actualizarCarrito()
                                actualizarPayBody(carrito)  
                            }
                            localStorage.setItem('cartProducts', JSON.stringify(carrito))
                            mostrarEnElCarro()
                            actualizarCarrito()
                            actualizarPayBody(carrito)  
                        } else {
                            showMsm("Carrito", "El producto no existe")
                        }
                    })
                })

                // ENVIAR EL PRODUCTO A FAVORITOS
                let sendButton = document.querySelectorAll(".save-for-later");
                sendButton.forEach(btn => {
                    btn.addEventListener("click", ()=>{
                        let padre = btn.parentNode.parentNode;
                        let sendId = padre.children[6].value;
                        favoritesArray.push(sendId)
                        localStorage.setItem("favProducts", JSON.stringify(favoritesArray))
                        showMsm("Favoritos", "Se ha agregado a favoritos")
                    })
                })
            
                // ELIMINA EL PRODUCTO DEL CARRITO
                const removeButton = document.querySelectorAll(".Remove")
                removeButton.forEach(remBtn => {
                    remBtn.addEventListener("click", () => {
                            let papa = remBtn.parentNode.parentNode
                            const idPost = papa.children[6].value
                            let carrito = JSON.parse(localStorage.getItem('cartProducts')) || []

                            const ElProductoExiste = carrito.findIndex(item => item.id === idPost)
                            if (ElProductoExiste !== -1) {
                                carrito.splice(ElProductoExiste, 1)
                                localStorage.setItem("cartProducts", JSON.stringify(carrito))
                                showMsm("Carrito eliminado", "Se ha eliminado el producto del carrito")
                                mostrarEnElCarro()
                                actualizarCarrito()
                                actualizarPayBody(carrito)  
                            } else {
                                showMsm("Carrito", "El producto no existe")
                            }
                            actualizarPayBody(carrito)  
                        })
                    })
        actualizarCarrito()
    } else {
        showMsm("carrito", "No se pudo cargar el carrito")
    }
    actualizarPayBody(carrito)
    console.log("hola")
    productosComprados()
}
  
mostrarEnElCarro()

// MOSTRAMOS TODOS LOS PRODUCTOS COMPRADOS
function productosComprados (){
    const compradosContainer = document.querySelector(".comprados")
    let savePrices = []
    compradosContainer.innerHTML = `<h2 class="pay-title">Purchased Products</h2>`;
    fetch("http://localhost:3000/comprados",{
        headers: {
            'Cache-Control': 'no-cache',
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    })
    .then(data => data.json())
    .then(data => {
        if(data.length !== -1){
            for(i = 0; i < data.length; i++){
                for(p = 0; p < data[i].allProducts.length; p++){
                    savePrices.push(data[i].allProducts[p].realPrice - data[i].allProducts[p].precioFinal)
                    compradosContainer.innerHTML += `
                    <div class="cart-product">
                        <img src="${data[i].allProducts[p].img}" alt="">
                        <div class="product-info">
                            <p class="cart-title">${data[i].allProducts[p].titulo}</p>
                            <p class="sold-by"><strong>Sold By:</strong> ${data[i].allProducts[p].autor}</p>
                            <p class="quantity"><strong>Quantity:</strong> -${data[i].allProducts[p].gramos}</p>
                        </div>
                        <div class="cart-card-price">
                            <p class="min-p">Price</p>
                            <div class="prices">
                                <p class="prince">$${data[i].allProducts[p].precioFinal}</p>
                                <p class="discount-price">$${data[i].allProducts[p].realPrice}</p>
                            </div>
                            <p class="save-price">You save: <strong>$${savePrices[p].toFixed(2)}</strong></p>
                        </div>
                        <div class="total-price-cart">
                            <p class="min-p">Total</p>
                            <p class="totalPrice">$${data[i].allProducts[p].precioMult}</p>
                        </div>
                    </div>
                `;
                }
            }
        }
        if(data.length == 0){
            compradosContainer.innerHTML = ` <p class="min-p center"><i class="ri-emotion-happy-line"></i> Cuando Compres un producto, aparecera aqui.</p>`;
        }
    })
    .catch(err => {                    
        console.log(err, "Se ha producido un error al mostrar los productos comprados")    
    })
}

// ACTUALIZAMOS LA INFORMACION DE PAGO
function actualizarPayBody (allProducts){
    const precioTotalPay = parseFloat(JSON.parse(localStorage.getItem("precio"))) || 0;
    let precioEnvio = 6.87;
    // VALIDAR QUE EL PRECIO SEA PARA NO ESTABLECER EL PRECIO DEL ENVIO
    if(precioTotalPay == 0){
        precioEnvio = 0;
    }
    let precioSumado = precioTotalPay + precioEnvio;
    
    // CREAMOS LOS PRODUCTOS A COMPRAR Y UNA VEZ SEAN COMPRADOS, DEFIMIMOS EL LOCALSTORAGE DEL CARRITO CON dataVacia[] para que se remplace la informacion
    const dataVacia = [];
    const payContainer = document.querySelector(".pay-container")
    payContainer.innerHTML = "";
    payContainer.innerHTML += `
    <h2 class="pay-title">Cart Total</h2>
    <p class="min-p">Coupon Apply</p>
    <div class="input-container">
        <input type="text" name="cupon" id="cupon" placeholder="Enter Coupon Code here...">
        <button>Apply</button>
    </div>
    <div class="prices-pay-container">
        <div class="subtotal">
            <p class="min-p">Subtotal</p>
            <p class="p">$${precioTotalPay}</p>
        </div>
        <div class="price-coupon">
            <p class="min-p">Coupon Discount</p>
            <p class="p">(-)0.00</p>
        </div>
        <div class="shipping">
            <p class="min-p">Shipping</p>
            <p class="p">$${precioEnvio}</p>
        </div>
            <div class="pay-total">
                <h2>Total (USD)</h2>
                <h2>$${precioSumado.toFixed(2)}</h2>
            </div>
            <div class="pay-actions">
            <button class="submit">Process To Checkout</button>
        <a href="/" class="return"><i class="ri-arrow-left-line"></i> Return To Shopping</a>
        </div>
    </div>
    `

    // VALIDAR QUE EL PRECIO SEA  PARA EVITAR ABRIR EL FORMULARIO
    if(precioTotalPay == 0){
        const showForm = document.querySelector(".submit")
        showForm.addEventListener("click", ()=>{
            showMsm("carrito", "Debes agregar al menos un producto")
        })
    }else{
        // MOSTRAR FORMULARIO
        const showForm = document.querySelector(".submit")
        showForm.addEventListener("click", ()=>{
            const formulario = document.querySelector(".formularioCompra")
            formulario.classList.toggle("oculto")
        })

        // OCULTAR EL FORMULARIO
        const hiddeForm = document.querySelector(".cancelBuy")
        hiddeForm.addEventListener("click", ()=>{
            const formulario = document.querySelector(".formularioCompra")
            formulario.classList.toggle("oculto")
        })                                                  
    }

    // ENVIAR LOS DATOS AL FORMULARIO
    const buyBtn = document.querySelector(".buyBtn")
    buyBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let nombre = document.querySelector("#nombreUsuario").value
        let direccion = document.querySelector("#direccion").value
        let telefono = document.querySelector("#telefono").value

        let bodyCompradores = {
            nombre,
            direccion,
            telefono,
            idProducts: 1
        }

        let bodyProductos = {
            pagado: precioSumado.toFixed(2),
            telefonoComprador: telefono,
            allProducts,
            nombre,
            direccion,
        }

        fetch("http://localhost:3000/comprados",{
            cache: "no-store"
        })
        .then(productos => productos.json())
        .then(productos => {

            let elProductExistente = productos.find(producto => producto.telefonoComprador === telefono)

            if(elProductExistente){
                let precioTotal = parseFloat(elProductExistente.pagado) + parseFloat(precioSumado)

                let newBody = {
                    pagado: precioTotal.toFixed(2),
                    telefonoComprador: telefono,
                    nombre,
                    direccion,
                    allProducts: [...elProductExistente.allProducts, ...allProducts]
                }

                fetch(`http://localhost:3000/comprados/${elProductExistente.id}`,{
                    method: "PUT",
                    headers: {
                        'Cache-Control': 'no-cache',
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newBody)
                })
                .catch(err, console.log(err))
            } else {
                fetch("http://localhost:3000/comprados",{
                    method: "POST",
                    headers: {
                        'Cache-Control': 'no-cache',
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyProductos)
                })
            }
        })



        fetch("http://localhost:3000/compradores",{
            headers: {
                'Cache-Control': 'no-cache',
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
        .then(compradores => compradores.json())
        .then(compradores => {
            let usuarioExistente = compradores.find(compradores => compradores.telefono === telefono)
            if(usuarioExistente){
                console.log(usuarioExistente)
            }else{
                fetch("http://localhost:3000/compradores",{
                    method: "POST",
                    headers: {
                        'Cache-Control': 'no-cache',
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyCompradores)
                })
            }
        })


    localStorage.setItem("cartProducts", JSON.stringify(dataVacia))
    showMsm("carrito comprado", "Se ha completado la compra")
    setTimeout(() => {
        actualizarPayBody([])
        productosComprados()
        window.location.href = "/Cart";
    }, 800);
    })

}
  

// ACTUALIZAMOS LA INFORMACION DEL CARRITO SEGUN HAYANN MODIFICACIONES EN LA MSIMA
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
        showMsm("carrito", "No hay ningun producto")
    }
}


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


// SUBIR PAGINA
const upBtn = document.querySelector(".up")
upBtn.addEventListener("click", ()=>{
    document.documentElement.scrollTop = 0;
})
