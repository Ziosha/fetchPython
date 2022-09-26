let root = document.getElementById('root'),
    agregar = document.getElementById('agregar'),
    search = document.getElementById('search'),
    searchOk = document.getElementById('searchOk'),
    title = document.getElementById('title');

//render listar producto
const render = (n,e,p,w,c) => 
{
    return `
    <div class="card animate__animated animate__fadeInBottomRight" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${n}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Producto</h6>
      <p class="card-text">Codigo: ${e}</p>
      <p class="card-text">Precio compra: ${p}</p>
      <p class="card-text">Precio venta: ${w}</p>
      <p class="card-text">Stock: ${c}</p>
      <button type="submit" class="btn btn-success" onclick = "modificar_producto(${e})" id="Modificar">Modificar</button>
      <button type="submit" class="btn btn-danger" onclick = "eliminar_producto(${e})" id="Eliminar">Eliminar</button>
    </div>
  </div>
    `
}
//render agregar prodcutos
const add_product = () =>
{
  return `
  <div class="container">
  <h2>Agregar producto</h2>
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="Nombre" placeholder="Nombre Producto" required>
      <label for="Nombre">Nombre Producto</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="PrecioCompra" placeholder="Precio Compra" required>
      <label for="PrecioCompra">Precio Compra</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="PrecioVenta" placeholder="Precio Venta" required>
      <label for="PrecioVenta">Precio Venta</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="Stock" placeholder="Cantidad del producto" required>
      <label for="Stock">Cantidad del Producto</label>
    </div>
  
    <button type="submit" class="btn btn-primary" id="registrar">Registrar</button>
  </div>
  `
}
//listar productos
const get_producto = () =>
{
  agregar.style.visibility = 'visible'
  title.style.visibility = 'visible'
  root.innerHTML = null
  const producto = fetch("http://localhost:3000/productos")
  producto.then(res => res.json())
          .then(data => {
              data.forEach(element => {
                const {CodProdcuto, Nombre, PrecioCompra, PrecioVenta, Stock} = element
                root.innerHTML += render(Nombre, CodProdcuto, PrecioCompra, PrecioVenta, Stock)
              });
          })
          .catch(error => console.log(error))
}
//render modificar producto
const mod_product = (n,c,v,s) =>
{
  return `
  <div class="container">
  <h2>Modificar producto</h2>
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="Nombre" value="${n}" >
      <label for="Nombre">Nombre Producto</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="PrecioCompra" value="${c}">
      <label for="PrecioCompra">Precio Compra</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="PrecioVenta" value="${v}">
      <label for="PrecioVenta">Precio Venta</label>
    </div>
    <div class="form-floating mb-3">
      <input type="number" class="form-control" id="Stock" value="${s}">
      <label for="Stock">Cantidad del Producto</label>
    </div>
  
    <button type="submit" class="btn btn-primary" id="modificar">Modificar</button>
  </div>
  `
}
// agregar producto
agregar.addEventListener("click", function(){
  root.innerHTML = null
  agregar.style.visibility = 'hidden'
  title.style.visibility = 'hidden'
  root.innerHTML = add_product()
  let nombre = document.getElementById('Nombre'),
    precioCompra = document.getElementById('PrecioCompra'),
    precioVenta = document.getElementById('PrecioVenta'),
    stock = document.getElementById('Stock'),
    registrar = document.getElementById('registrar');

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
                      get_producto()
                  }
                  else {alert("error al registrar producto")}
  
              })
              .catch(error => console.log(error))
  
  })
})

//Modificar producto
const modificar_producto = (c) => {
  
  const modProd = fetch(`http://localhost:3000/productos/${c}`)
  modProd.then(resp => resp.json())
          .then(data => {
            const {CodProdcuto, Nombre, PrecioCompra, PrecioVenta, Stock} = data[0]
               root.innerHTML = null
               agregar.style.visibility = 'hidden'
               title.style.visibility = 'hidden'

               root.innerHTML = mod_product(Nombre,PrecioCompra, PrecioVenta, Stock)

               let modi = document.getElementById('modificar'),
                   nombre = document.getElementById('Nombre'),
                   precioCompra = document.getElementById('PrecioCompra'),
                   precioVenta = document.getElementById('PrecioVenta'),
                   stock = document.getElementById('Stock')

                modi.addEventListener('click', function(){
                  var datos = {
                    Nombre : nombre.value,
                    PrecioCompra : precioCompra.value,
                    PrecioVenta : precioVenta.value,
                    Stock : stock.value
                  }
                  
                  const senmod = fetch(`http://localhost:3000/productos/${c}`,{
                    method: 'PUT',
                    body : JSON.stringify(datos),
                    headers : {'Content-Type': 'application/json'}
                  })
                  senmod.then(resp => resp.json())
                          .then(data => {
                              get_producto()
                              if(data == 1)
                              {
                                alert("Producto modificado")
                              }
                              else{
                                alert("Producto no modificado")
                              }
                          })
                          .catch(error => console.log(error))

                })
          })
          .catch(erro => console.log(erro))
}

// ELiminar producto
const eliminar_producto = (c) =>
{
  const eliminar = fetch(`http://localhost:3000/productos/${c}`,{
        method:'DELETE'
  })
  eliminar.then(res => res.json())
          .then(data => {
              get_producto()
              if(data == "1")
              {
                alert("Dato eliminado")
              }
              else
              {
                alert("Dato no eliminado")
              }
          })
          .catch(error => console.log(error))
}

//buscar producto

searchOk.addEventListener('click', function(){
  if(search.placeholder != "Search" || search.value != "")
  {
    root.innerHTML = null
    const filtrar = fetch(`http://localhost:3000/producto/search/${search.value}`)
    filtrar.then(res => res.json())
            .then(data => {
              data.forEach(element => {
                  const {CodProdcuto, Nombre, PrecioCompra, PrecioVenta, Stock} = element
                  root.innerHTML += render(Nombre, CodProdcuto, PrecioCompra, PrecioVenta, Stock)
              });
            })
            .catch(error => console.log(error))
  }
  else { 
    root.innerHTML = null
    const producto = fetch("http://localhost:3000/productos")
    producto.then(res => res.json())
            .then(data => {
                data.forEach(element => {
                  const {CodProdcuto, Nombre, PrecioCompra, PrecioVenta, Stock} = element
                  root.innerHTML += render(Nombre, CodProdcuto, PrecioCompra, PrecioVenta, Stock)
                });
            })
            .catch(error => console.log(error))
  } 
})


get_producto()