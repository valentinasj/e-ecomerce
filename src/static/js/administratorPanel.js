// TRAER LA DATA
fetch("http://localhost:3000/productos",{
    headers: {
        'Cache-Control': 'no-cache',
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
})
.then(data => data.json())
.then(data => mostrarData(data))
.catch(err => showMsm(err, "No se ha podido cargar los productos"))


function mostrarCompradores (){

    let compradoresContainer = document.querySelector(".compradores");

    compradoresContainer.innerHTML = "";
    
    // Obtenemos los compradores
    fetch(`http://localhost:3000/comprados`, {
      headers: {
        'Cache-Control': 'no-cache',
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            for(i = 0; i < data.length; i++){
                let products = ""; // Agrega una variable para almacenar los productos del cliente
                for(p = 0; p < data[i].allProducts.length; p++){
                    products += `
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
                          <p class="save-price">You save: <strong>$${(data[i].allProducts[p].realPrice - data[i].allProducts[p].precioFinal).toFixed(2)}</strong></p>
                      </div>
                      <div class="total-price-cart">
                          <p class="min-p">Total</p>
                          <p class="totalPrice">$${data[i].allProducts[p].precioMult}</p>
                      </div>
                    </div>
                    `;
                }
                compradoresContainer.innerHTML += `
                <div class="userInfo">
                  <p class="userName"><strong>Name</strong> ${data[i].nombre}</p>
                  <p class="phoneNumber"><strong>Contact Phone:</strong> ${data[i].telefonoComprador}</p>
                  <p class="direccion"><strong>Address:</strong> ${data[i].direccion}</p>
                  <details class="comprados no-mg">
                      <summary>Productos comprados</summary>
                          ${products}
                  </details>
                </div>
                `;
            }
        } else {
            compradoresContainer.innerHTML += `<p class="min-p center"><i class="ri-emotion-line"></i> No hay compradores aún</p>`;;
        }
    })
    .catch(error => showMsm(error, "Ha ocurrido un error al cargar los datos")); 
    
    
    
    
}

mostrarCompradores()


// Contenedor de los objetos de la pantalla principal
let productosContainer = document.querySelector(".products-admin")

function mostrarData (data) {
    productosContainer.innerHTML = `
        <a href="/createUpdateProducts" class="def dife">
            <i class="ri-shopping-cart-2-line"></i>
            <p class="createProduct-parraf">Create a new product</p>
        </a>
    `;

    for(i = 0; i < data.length; i++){
        productosContainer.innerHTML += `
        <div class="product-card def">
            <div class="product-card-img">
                <img src="${data[i].rutaImg}" alt="">
                <div class="product-controls">
                    <button><i class="ri-eye-line"></i></button>
                    <button><i class="ri-restart-line"></i></button>
                    <button type="submit" class="send-favorites"><i class="ri-heart-fill"></i></button>

                </div>
            </div>
            <div class="product-card-info">
                <p class="product-card-name">${data[i].title}</p>
                <div class="product-card-price">
                    <p class="first-price">$${data[i].precio}</p>
                    <p class="second-price">$${data[i].RealPrice}</p>
                </div>
                <form action="/createUpdateProducts" method="get">
                    <input type="hidden" name="idProduct" value="${data[i].id}">
                    <input type="hidden" name="author" value="${data[i].autor}">
                    <input type="hidden" name="gramos" value="${data[i].gramosUnidades}">
                    <input type="hidden" name="titulo" value="${data[i].title}">
                    <input type="hidden" name="precioDescuento" value="${data[i].precio}">
                    <input type="hidden" name="precioNormal" value="${data[i].RealPrice}">
                    <input type="hidden" name="img" value="${data[i].rutaImg}">
                    <div class="add-product dof">
                        <button type="submit" class="modify">Modify Product</button>
                        <button type="submit" class="delete">Delete Product</button>
                    </div>
                </form>
            </div>
        </div>`;

    }

    //  ELIMINAR EL PRODUCTO
    const deleteBtn = document.querySelectorAll(".delete")
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", (e)=>{
            e.preventDefault();
            const papa = btn.parentNode.parentNode;
            let productoId = parseInt(papa.children[0].value)
            fetch(`http://localhost:3000/productos/${productoId}`, {
                method: "DELETE",
                headers: {
                    'Cache-Control': 'no-cache',
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            })
            .then(respuesta =>{
                if(!respuesta.ok){
                    throw new Error("Hubo un error al eliminar el producto")
                }
                showMsm("admin", "Se ha eliminado el producto")
                setTimeout(() => {
                    location.reload()
                }, 800);
            })
            .catch(err, console.log(err))
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
            console.log(precioTotal)
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


// MOSTRAR LOS CLIENTES
const ShowClients = document.querySelector(".showClients")
ShowClients.addEventListener("click", ()=>{
    const compradoresContainer = document.querySelector(".compradores")
    compradoresContainer.classList.toggle("clientsShow")
    if(compradoresContainer.classList[1] == "clientsShow"){
        ShowClients.innerHTML = `<i class="ri-user-3-line"></i> Hidde Customers`
    }else{
        ShowClients.innerHTML = `<i class="ri-user-3-line"></i> Show Customers`
    }
})