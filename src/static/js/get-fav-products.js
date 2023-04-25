function traerFavoritos() {
    let favProducts = JSON.parse(localStorage.getItem("favProducts"));
  
    if (favProducts && favProducts.length > 0) {
      let productCards = "";
        
      for (let i = 0; i < favProducts.length; i++) {
        fetch(`http://localhost:3000/productos/${favProducts[i]}`,{
            headers: {
                'Cache-Control': 'no-cache',
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
          .then((response) => response.json())
          .then((data) => {
            productCards += ` <div class="product-card small">
            <div class="product-card-img">
                <img src="${data.rutaImg}" alt="">
                <div class="product-controls">
                    <button><i class="ri-eye-line"></i></button>
                    <button><i class="ri-restart-line"></i></button>
                    <button type="submit" class="send-favorites"><i class="ri-heart-fill"></i></button>
                    <input type="hidden" name="idProduct" value="${data.id}">
                    <input type="hidden" name="author" value="${data.autor}">
                    <input type="hidden" name="gramos" value="${data.gramosUnidades}">
                </div>
            </div>
            <div class="product-card-info">
                <p class="product-card-name">${data.title}</p>
                <div class="product-card-price">
                    <p class="first-price">$${data.precio}</p>
                    <p class="second-price">$${data.RealPrice}</p> 
                </div>
                <div class="product-stars">
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-line"></i>
                    <p class="star-parraf">In Stock</p>
                </div>
                    <div class="add-product dif">
                    <p>Add</p>
                    <button class="add-cart"><i class="ri-add-line"></i></button>
                </div>
            </div>
        </div>`;
  
            document.querySelector(".fav-products").innerHTML = productCards;



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



            // FUCIONALIDAD DEL BOTON DE FAVRITOS
            let sendButton = document.querySelectorAll(".send-favorites");
            sendButton.forEach(btn => {
                btn.addEventListener("click", ()=>{
                    let padre = btn.parentNode.parentNode.parentNode;
                    let sendId = padre.children[0].children[1].children[3].value;
                    function removeIdFromArray(id, array) {
                        const index = array.indexOf(id);
                        if (index !== -1) {
                          array.splice(index, 1);
                        }
                        return array;
                      }
                      let updatedIds = removeIdFromArray(sendId, favProducts);
                      localStorage.setItem("favProducts", JSON.stringify(updatedIds))
                      location.reload()
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

            

          })
          .catch((err) => showMsm(err, "No se pudo cargar los productos"));
      }
    } else {
        showMsm("No se han agregado productos", "No se han agregado productos")
    }
    actualizarCarrito()
  }
  
  traerFavoritos();
  

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



