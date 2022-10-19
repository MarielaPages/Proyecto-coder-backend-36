
let cart = []

//Saco array cart del localStorage
if (localStorage.getItem("carrito actualizado")) {
    cart = JSON.parse(localStorage.getItem("carrito actualizado"));
}

//Funcion para que el carrito se acutualice a la persona que esta loggeada ahora cuando va a mirar los productos disponibles a comprar
async function updateCart(){
    const carritoAbiertoResp = await fetch(`http://localhost:8081/cart`);
    const carritoAbierto = await carritoAbiertoResp.json()

    cart = carritoAbierto.products

    localStorage.setItem("carrito actualizado", JSON.stringify(cart));
}


//Funcion para comprar productos y ponerlos en carrito del front
async function buy(id, stock, price, title, thumbnail){ //el id y stock llegan como str

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

        //Updateo el carrito abierto de este usario
        let cartPut = {cart: cart}
        const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cartPut)
        }
        await fetch(`http://localhost:8081/cart`, options);

    } else if(cantProd >= stockParse){
        cantProd = stockParse
        const prodObj = {product: id, amount: cantProd, price: priceParse, title: title, thumbnail: thumbnail}

        cart.push(prodObj)

        localStorage.setItem("carrito actualizado", JSON.stringify(cart));

        //Updateo el carrito abierto de este usario 
        let cartPut = {cart: cart}
        const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cartPut)
        }
        await fetch(`http://localhost:8081/cart`, options);
    }
}

//Funcion que permite ver carrito
async function showCart(){
    try{
        const carritoAbiertoResp = await fetch(`http://localhost:8081/cart`);
        const carritoAbierto = await carritoAbiertoResp.json()

        cart = carritoAbierto.products

        localStorage.setItem("carrito actualizado", JSON.stringify(cart));

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
            cartSection.innerHTML = `<h2 class="noProdsCart">Tu carrito se encuentra vacío. No has seleccionado productos.</h2>`
        }

    } catch(error){
        throw error
    }
}


//Funcion para borrar productos del carrito
async function deleteFromCart(id){ //el id llega como str
    cart.forEach( (obj, index ) => {
        if(obj.product == id){
            cart.splice(index, 1)

            localStorage.setItem("carrito actualizado", JSON.stringify(cart))
            }
    })

    //Updateo el carrito abierto de este usario
    let cartPut = {cart: cart}
    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(cartPut)
    }
    await fetch(`http://localhost:8081/cart`, options);

    showCart()
}

//Funcion para terminar la compra y que se envie todo a la ruta de carrito para que se guarde la compra
async function endPurchase(){
    try{
        let cartPost = {cart: cart}
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cartPost)
        }
        await fetch(`http://localhost:8081/cart`, options);

        //Se libera el carro luego de la compra
        cart = []
        localStorage.setItem("carrito actualizado", JSON.stringify(cart));

        //Updateo el carrito abierto de este usario
        let cartPut = {cart: cart}
        const options2 = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cartPut)
        }
        await fetch(`http://localhost:8081/cart`, options2);

        document.getElementById('cartContainer').innerHTML = "<div class='d-flex justify-content-center'><h2>Gracias por su compra!</h2></div>"

    }catch(error){
        throw error
    }
}

const socket = io();

const button2 = document.getElementById('button2')
const email = document.getElementById('email')
const message = document.getElementById('message')

button2.addEventListener("click", () => {
    const d = new Date();
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const second = d.getSeconds()
    const date = `${day}-${month}-${year} ${hour}:${minutes}:${second}`
    const personMessage = {userEmail: email.value, date: date , message: message.value, destination: "seller@seller"}
    socket.emit("newMessage", personMessage)
    button2.value = ''
    email.value=''
    message.value=''
})

const messagesContainer = document.getElementById("messagesContainer")

socket.on('mensajesEnviados', mensajes =>{
    messagesContainer.classList.add("mensajesContainerStyles")
    if(mensajes.length>0){
        messagesContainer.innerHTML = mensajes.map(mensaje => {
            return(`<p><span class="mail">${mensaje.userEmail} </span>
                <span class="fecha">[${mensaje.date}]: </span>
                <span class="msj">${mensaje.message}</span></p>`)
        }).join(' ');
    }
    else{
        messagesContainer.innerHTML = ''
        messagesContainer.classList.remove("mensajesContainerStyles")
    }
})