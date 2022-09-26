
let nombre = document.getElementById('Nombre'),
    precioCompra = document.getElementById('PrecioCompra'),
    precioVenta = document.getElementById('PrecioVenta'),
    stock = document.getElementById('Stock')
    registrar = document.getElementById('registrar')

registrar.addEventListener("click", function (){
    let data = {
        Nombre : nombre.value,
        PrecioCompra : precioCompra.value,
        PrecioVenta : precioVenta.value,
        Stock : stock.value
    }

    const addProd = fetch("http://localhost:3000/productosAut",{
        method : 'POST',
        body:  JSON.stringify(data),
        headers:{'Content-Type': 'application/json'}
    })
    addProd.then(res => res.json())
            .then(data => {
                if(data = "registrado")
                {
                    alert("Producto registrado")
                    window.open('http://localhost:5500/frontend/index.html','_self');
                }
                else {alert("error al registrar producto")}

            })
            .catch(error => console.log(error))

})



const modificar_producto = (c) =>
{
    console.log(c)
}