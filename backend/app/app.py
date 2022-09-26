
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = 'productosdb'

mysql = MySQL(app)

@app.route('/', methods = ['GET'])
def inicio():
    return jsonify({"message": "Hola Mundo"})

@app.route('/productos')
def producto():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('select * from producto')
        datos = cursor.fetchall()
        producto = []

        for dato in datos:
            productos = { 'CodProdcuto':dato[0], 'Nombre':dato[1], 'PrecioCompra':dato[2], 'PrecioVenta':dato[3], 'Stock':dato[4]}
            producto.append(productos)
        return producto

    except Exception as ex:
        return ("Error_al_listar")


@app.route('/productos', methods = ['POST'])
def add_producto():
    try:
        codProducto = request.json['CodProducto']
        nombre = request.json['Nombre']
        precioCompra = request.json['PrecioCompra']
        precioVenta = request.json['PrecioVenta']
        stock = request.json['Stock']

        cursor = mysql.connection.cursor()
        sql = """insert into producto (CodProducto, Nombre, PrecioCompra, PrecioVenta, Stock) 
        values ({0}, '{1}', {2}, {3}, {4})""".format(codProducto, nombre, precioCompra, precioVenta, stock)
        cursor.execute(sql)
        mysql.connection.commit()
        res = jsonify('Registrado')
        res.status_code = 201
        return res
    except Exception as ex:
        res = jsonify('Error_al_crear')
        res.status_code = 404
        return res
                        

@app.route('/productos/<codigo>', methods = ['PUT'])
def up_producto(codigo):
    try:
        nombre = request.json['Nombre']
        precioCompra = request.json['PrecioCompra']
        precioVenta = request.json['PrecioVenta']
        stock = request.json['Stock']

        cursor = mysql.connection.cursor()
        sql = """update producto set Nombre = '{0}', PrecioCompra = {1},  PrecioVenta = {2}, Stock = {3} where CodProducto = {4} 
        """.format(nombre, precioCompra, precioVenta, stock, codigo)
        cursor.execute(sql)
        mysql.connection.commit()
        res = jsonify('1')
        res.status_code = 200
        return res
    except Exception as ex:
        res = jsonify('Error_al_editar')
        res.status_code = 404
        return res

@app.route('/productos/<codigo>', methods = ['DELETE'])
def del_producto(codigo):
    try:
        cursor = mysql.connection.cursor()
        sql = """delete from producto where CodProducto = {0} 
        """.format(codigo)
        cursor.execute(sql)
        mysql.connection.commit()
        res = jsonify('1')
        res.status_code = 200
        return res
    except Exception as ex:
        res = jsonify('Error_al_eliminar')
        res.status_code = 404
        return res

@app.route('/productos/<codigo>')
def get_producto_id(codigo):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""select * from producto where CodProducto = {0}""".format(codigo))
        datos = cursor.fetchall()
        producto = []

        for dato in datos:
            productos = { 'CodProdcuto':dato[0], 'Nombre':dato[1], 'PrecioCompra':dato[2], 'PrecioVenta':dato[3], 'Stock':dato[4]}
            producto.append(productos)
        return producto

    except Exception as ex:
        return ("Error_al_listar")

@app.route('/productosAut', methods = ['POST'])
def add_producto_aut():
    try:

        nombre = request.json['Nombre']
        precioCompra = request.json['PrecioCompra']
        precioVenta = request.json['PrecioVenta']
        stock = request.json['Stock']

        cursor = mysql.connection.cursor()
        cursor.execute('select CodProducto from producto order by CodProducto desc limit 1')
        codigo = cursor.fetchone()
        if codigo == None:
            dato = 1
        else:
            dato = int(codigo[0]) + 1

        cursor = mysql.connection.cursor()
        sql = """insert into producto (CodProducto, Nombre, PrecioCompra, PrecioVenta, Stock) 
        values ({0}, '{1}', {2}, {3}, {4})""".format(dato, nombre, precioCompra, precioVenta, stock)
        cursor.execute(sql)
        mysql.connection.commit()
        res = jsonify('Registrado')
        res.status_code = 201
        return res
    except Exception as ex:
        res = jsonify('Error_al_crear')
        res.status_code = 404
        return res

@app.route('/producto/search/<nombre>')
def search(nombre):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""select * from producto where Nombre like '%{0}%'""".format(nombre))
        datos = cursor.fetchall()
        producto = []

        for dato in datos:
            productos = { 'CodProdcuto':dato[0], 'Nombre':dato[1], 'PrecioCompra':dato[2], 'PrecioVenta':dato[3], 'Stock':dato[4]}
            producto.append(productos)
        return producto

    except Exception as ex:
        return ("Error_al_listar")


if(__name__ == '__main__'):
    app.run(debug = True, port = 3000)
