function recibirDataUrl(){
    const parametros = new URLSearchParams(window.location.search);
    const id = parseInt(parametros.get('idProduct'));
    const autor = parametros.get('author');
    const cantidad = parametros.get('gramos');
    const titulo = parametros.get('titulo');
    const precioDescuento = parseFloat(parametros.get('precioDescuento'));
    const precioNormal = parseFloat(parametros.get('precioNormal'));
    const imgRuta = parametros.get('img'); 

    if ( isNaN(id) || id === null || isNaN(precioDescuento) 
            || precioDescuento === null || isNaN(precioNormal) 
            || precioNormal === null || autor === null || cantidad === null 
            || titulo === null || imgRuta === null) {
            crearProducto()
        }else{
            actualizarProducto(id, autor, cantidad, titulo, precioDescuento, precioNormal, imgRuta)
        }

        actualizarCarrito()
}

recibirDataUrl()

function actualizarProducto(id, autor, cantidad, titulo, precioDescuento, precioNormal, imgRuta){
    const formulario = document.querySelector(".formulario")
    formulario.innerHTML = "";
    formulario.innerHTML += `
    <h2 class="pay-title">Update a Product</h2>
    <div class="form-img">
        <img src="${imgRuta}">
        </div>
        <div class="input-group">
            <span>Titulo Producto:</span>
            <input type="text" name="titulo" class="tituloInput" value="${titulo}" placeholder="Bebida refrescante...">
            <span>Precio Descuento:</span>
            <input type="text" name="precioDescuento" class="precioDescuentoInput" value="${precioDescuento}" placeholder="El precio que el cliente pagara... (opcional)">
            <span>Precio sin Descuento:</span>
            <input type="text" name="precioNormal" class="precioNormalInput" value="${precioNormal}" placeholder="El precio sin descuento... (opcional)">
            <span>Nueva Imagen:</span>
            <input type="text" name="nuevaImg" class="nuevaImgInput" value="" placeholder="Pon la URL de te nueva imagen (opcional)">
            <span>Cantidad del producto:</span>
            <input type="text" name="Cantidad" class="cantidadInput" value="${cantidad}" placeholder="Ej: (1L, 15x, 600G, etc)">
            <span>Autor:</span>
            <input type="text" name="Autor" class="autorInput" value="${autor}" placeholder="Luis, Maria o tu nombre (opcional)">
            <span>Categoria del producto:</span>
            <select name="categoria" class="categoriaInput">
                <option value="Vegetable & Fruit">Vegetable & Fruit</option>
                <option value="Beverages">Beverages</option>
                <option value="Meats & Seafood">Meats & Seafood</option>
                <option value="Breakfast & Dairy">Breakfast & Dairy</option>
                <option value="Frozen Foods">Frozen Foods</option>
                <option value="Biscuits & Snacks">Biscuits & Snacks</option>
                <option value="Grocery & Staples">Grocery & Staples</option>
                <option value="Wines & Alcohol Drinks">Wines & Alcohol Drinks</option>
            </select>
            <input type="hidden" name="id" class="idInput" value="${id}">
            <div class="actionsForm">
                <a href="/admin" class="cancelBuy">Cancelar</a>
                <button type="submit" class="update">Enviar</button>
            </div>
        </div>
    `;

    // ACTUALIZAR EL PRODUCTO SELECCIONADO
    formulario.addEventListener("submit", (e)=>{

        e.preventDefault()

        const titulo = document.querySelector(".tituloInput").value
        const precioDescuento = parseFloat(document.querySelector(".precioDescuentoInput").value)
        const precioNormal = parseFloat(document.querySelector(".precioNormalInput").value)
        let nuevaImg = document.querySelector(".nuevaImgInput").value
        const cantidad = document.querySelector(".cantidadInput").value
        const autor = document.querySelector(".autorInput").value
        const categoria = document.querySelector(".categoriaInput").value
        const id = parseInt(document.querySelector(".idInput").value)

        let categoriaFinal;

        if(nuevaImg == ""){
            nuevaImg = imgRuta;
        }


        switch (categoria) {
            case "Vegetable & Fruit":
              categoriaFinal = 1;
              break;
            case "Beverages":
              categoriaFinal = 2;
              break;
            case "Meats & Seadfood":
              categoriaFinal = 3;
              break;
            case "Breakfast & Dairy":
              categoriaFinal = 4;
              break;
            case "Frozen Foods":
              categoriaFinal = 5;
              break;
            case "Biscuits & Snacks":
              categoriaFinal = 6;
              break;
            case "Grocery & Staples":
              categoriaFinal = 7;
              break;
            case "Wines & Alcohol Drinks":
              categoriaFinal = 8;
              break;
          }

        const newData = {
            title: titulo,
            rutaImg: nuevaImg,
            precio: precioDescuento,
            RealPrice: precioNormal,
            gramosUnidades: cantidad,
            autor,
            categoriaId: categoriaFinal
        }

        fetch(`http://localhost:3000/productos/${id}`, {
            method: "PATCH",
            headers: {
                'Cache-Control': 'no-cache',
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        })
        .then(respuesta =>{
            if(!respuesta.ok){
                throw new Error("Hubo un error al actualizar el producto")
            }
            showMsm("carrito actializado", "Se ha actualizado el producto")
            setTimeout(() => {
                window.location.href = "/admin";
            }, 800);
        })
        .catch(err, console.log(err))

    })
}

function crearProducto(){
    const formulario = document.querySelector(".formulario")
    formulario.innerHTML = "";
    formulario.innerHTML += `
    <h2 class="pay-title">Creat a new Product</h2>
        <div class="input-group">
            <span>Titulo Producto:</span>
            <input type="text" name="titulo" class="tituloInput" value="" placeholder="Bebida refrescante..."  required>
            <span>Precio Descuento:</span>
            <input type="text" name="precioDescuento" class="precioDescuentoInput" value="" placeholder="El precio que el cliente pagara... (Ej: 10.20)" required>
            <span>Precio sin Descuento:</span>
            <input type="text" name="precioNormal" class="precioNormalInput" value="" placeholder="El precio sin descuento... (Ej: 13.50)" required>
            <span>Nueva Imagen:</span>
            <input type="text" name="nuevaImg" class="nuevaImgInput" value="" placeholder="Pon la URL de te nueva imagen (Ej: https://example.com/imagen.png))" required>
            <span>Cantidad del producto:</span>
            <input type="text" name="Cantidad" class="cantidadInput" value="" placeholder="Ej: (1L, 15x, 600G, etc)" required>
            <span>Autor:</span>
            <input type="text" name="Autor" class="autorInput" value="" placeholder="Luis, Maria o tu nombre" required>
            <span>Categoria del producto:</span>
            <select name="categoria" class="categoriaInput">
                <option value="Vegetable & Fruit">Vegetable & Fruit</option>
                <option value="Beverages">Beverages</option>
                <option value="Meats & Seafood">Meats & Seafood</option>
                <option value="Breakfast & Dairy">Breakfast & Dairy</option>
                <option value="Frozen Foods">Frozen Foods</option>
                <option value="Biscuits & Snacks">Biscuits & Snacks</option>
                <option value="Grocery & Staples">Grocery & Staples</option>
                <option value="Wines & Alcohol Drinks">Wines & Alcohol Drinks</option>
            </select>
            <div class="actionsForm">
                <a href="/admin" class="cancelBuy">Cancelar</a>
                <button type="submit" class="update">Enviar</button>
            </div>
        </div>
    `;

      // CREAR EL PRODUCTO
      formulario.addEventListener("submit", (e)=>{

        e.preventDefault()

        const titulo = document.querySelector(".tituloInput").value
        const precioDescuento = parseFloat(document.querySelector(".precioDescuentoInput").value)
        const precioNormal = parseFloat(document.querySelector(".precioNormalInput").value)
        let nuevaImg = document.querySelector(".nuevaImgInput").value
        const cantidad = document.querySelector(".cantidadInput").value
        const autor = document.querySelector(".autorInput").value
        const categoria = document.querySelector(".categoriaInput").value

        let categoriaFinal;

        switch (categoria) {
            case "Vegetable & Fruit":
              categoriaFinal = 1;
              break;
            case "Beverages":
              categoriaFinal = 2;
              break;
            case "Meats & Seadfood":
              categoriaFinal = 3;
              break;
            case "Breakfast & Dairy":
              categoriaFinal = 4;
              break;
            case "Frozen Foods":
              categoriaFinal = 5;
              break;
            case "Biscuits & Snacks":
              categoriaFinal = 6;
              break;
            case "Grocery & Staples":
              categoriaFinal = 7;
              break;
            case "Wines & Alcohol Drinks":
              categoriaFinal = 8;
              break;
          }

        const newData = {
            title: titulo,
            rutaImg: nuevaImg,
            precio: precioDescuento,
            RealPrice: precioNormal,
            gramosUnidades: cantidad,
            autor,
            categoriaId: categoriaFinal
        }

        fetch(`http://localhost:3000/productos`, {
            method: "POST",
            headers: {
                'Cache-Control': 'no-cache',
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        })
        showMsm("carrito actializado", "Se ha creado el producto")
        setTimeout(() => {
            window.location.href = "/admin";
        }, 800);

    })
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
