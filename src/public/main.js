
let cart = []

//Saco array cart del localStorage
if (localStorage.getItem("carrito actualizado")) {
    cart = JSON.parse(localStorage.getItem("carrito actualizado"));
}

console.log(cart)

//Funcion para comprar productos y ponerlos en carrito del front
function buy(id, stock, price, title, thumbnail){ //el id y stock llegan como str
    let cantProd = parseInt(document.getElementById(`${id}`).value)
    let stockParse = parseInt(stock)
    let priceParse = parseInt(price)

    //Si ya habia puesto una cantidad de un producto, borra el objeto que refiere a ese producto con su cantidad
    cart.forEach( (obj, index ) => {
        if(obj.product == id){
            cart.splice(index, 1)

            localStorage.setItem("carrito actualizado", JSON.stringify(cart))
        }
    })

    //Crea el objeto con el id del producto y la cantidad que puso. No deja poner mas que el stock 
    if(cantProd <= stockParse && cantProd > 0){
        const prodObj = {product: id, amount: cantProd, price: priceParse, title: title, thumbnail: thumbnail}

        cart.push(prodObj)

        localStorage.setItem("carrito actualizado", JSON.stringify(cart));
    } else if(cantProd >= stockParse){
        cantProd = stockParse
        const prodObj = {product: id, amount: cantProd, price: priceParse, title: title, thumbnail: thumbnail}

        cart.push(prodObj)

        localStorage.setItem("carrito actualizado", JSON.stringify(cart));
    }
}

//Funcion para borrar carrito al deloguearte 
function logoutCart(){
    cart = []
    localStorage.setItem("carrito actualizado", JSON.stringify(cart));
}

function showCart(){
    let cartSection = document.getElementById('cart')
    if(cart.length>0){
        cartSection.innerHTML = cart.map(productCart => {
            return(
                `<table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Cantidad elegida</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Imagen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>${productCart.title}</td>
                        <td>${productCart.amount}</td>
                        <td>${productCart.price}</td>
                        <td>
                            <img src="${productCart.thumbnail}" alt="${productCart.title}" class="imgProd"> <!--El src lo va a ir a buscar a public porque alli declare que estan mis archivos estaticos-->
                        </td>
                        <td>
                        <button onclick="deleteFromCart('${productCart.product}')">Borrar</button>
                        </td>
                    </tr>
                    </tbody>
                </table>`
            )
        }).join('')
    } else{
        cartSection.innerHTML = `<h2>Tu carrito se encuentra vacío. No has seleccionado productos.</h2>`
    }
}


//Funcion para comprar productos y ponerlos en carrito del front
function deleteFromCart(id){ //el id llega como str
    cart.forEach( (obj, index ) => {
        if(obj.product == id){
            cart.splice(index, 1)

            localStorage.setItem("carrito actualizado", JSON.stringify(cart))
        }
    })
    showCart()
}

