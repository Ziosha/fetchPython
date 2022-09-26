
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = 'productosdb'

mysql = MySQL(app)

@app.route('/', methods = ['GET'])
def inicio():
    return jsonify({"message": "Hola Mundo"})

@app.route('/productos', methods = ['POST'])
def add_producto():
    try:
        codProducto = 0
        nombre = request.json['Nombre']
        precioCompra = request.json['PrecioCompra']
        precioVenta = request.json['PrecioVenta']
        stock = request.json['Stock']

        cursor = mysql.connection.cursor()
        sql = """call pproducto ({0}, '{1}', {2}, {3}, {4})""".format(codProducto, nombre, precioCompra, precioVenta, stock)
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
def up_producto():
    try:
        codigo = 0
        nombre = request.json['Nombre']
        precioCompra = request.json['PrecioCompra']
        precioVenta = request.json['PrecioVenta']
        stock = request.json['Stock']

        cursor = mysql.connection.cursor()
        sql = """call pproducto ({0}, '{1}', {2}, {3}, {4}) """.format(codigo, nombre, precioCompra, precioVenta, stock)
        cursor.execute(sql)
        mysql.connection.commit()
        res = jsonify('Registrado')
        res.status_code = 200
        return res
    except Exception as ex:
        res = jsonify('Error_al_editar')
        res.status_code = 404
        return res




if(__name__ == '__main__'):
    app.run(debug = True, port = 3000)
