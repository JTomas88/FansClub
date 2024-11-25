from flask import Flask, jsonify, Response,  request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
from api.models import db, Usuario, Sorteo, Evento, Entrevista
from dotenv import load_dotenv
from datetime import datetime
import os
import requests
from api.admin import setup_admin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token

# Cargar el archivo .env
load_dotenv()

# Acceder a la variable de entorno 'GOOGLE_API_KEY'
googleapykey=os.getenv('GOOGLE_API_KEY')

app = Flask(__name__)


# Configura la URI de la base de datos (en este caso SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # La base de datos estará en un archivo llamado 'data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar las notificaciones de modificaciones de objetos

# Inicializa SQLAlchemy con la app de Flask
db.init_app(app)

migrate = Migrate(app, db)

# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


jwt = JWTManager(app)





@app.route('/')
def sitemap():
    return generate_sitemap(app)

# Configura el Admin
setup_admin(app)



## ---------- >> USUARIOS, ACCESO Y CREACIÓN DE TOKENS << ------------- ##

 ## Creación de un nuevo usuario
@app.route('/registro', methods=['POST'])
def crear_usuario():
    data = request.json
    if 'usUsername' not in data or 'usEmail' not in data or 'usPassword' not in data:
        return jsonify ({"error": "falta alguno de los datos"}), 400
    
    if Usuario.query.filter_by(usEmail=data['usEmail']).first():
        return jsonify ({"error": "el correo electrónico ya existe"}), 400
    
    codificar_password = generate_password_hash(data['usPassword'])

    nuevo_usuario = Usuario(
        usUsername = data['usUsername'],
        usEmail = data['usEmail'],
        usPassword = codificar_password
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    access_token = create_access_token(identity=nuevo_usuario.usId)

    return jsonify({
        "mensaje": "nuevo usuario creado correctamente",
        "access_token": access_token,
        **nuevo_usuario.serialize()
    }), 201


#Obtener todos los usuarios
@app.route('/todoslosusuarios', methods=['GET'])
def obtener_todoslosusuarios():
    todosLosUsuarios = Usuario.query.all()
    return jsonify([usuarios.serialize() for usuarios in todosLosUsuarios])


#Obtener un usuario a través de su id
@app.route('/todoslosusuarios/<int:usId>', methods = ['GET'])
def obtener_usuarioPorId(usId):
    usuario = Usuario.query.get(usId)
    if usuario is None:
        return jsonify ({"error": "no se ha encontrado al usuario"}), 404
    
    return jsonify(usuario.serialize())


#Editar datos del usuario - Completar Registro
@app.route('/usuario/editar/<int:usId>', methods=['PUT'])
def editar_usuario(usId):
    usuario = Usuario.query.get(usId)

    if usuario is None:
        return jsonify({"error": "usuario no encontrado"}), 404
    
    data = request.json

    if not data:
        return jsonify({"error": "sin datos"}), 400
    
    if 'usEmail' in data:
        if Usuario.query.filter_by(usEmail=data['usEmail']).first() and data['usEmail'] != usuario.usEmail:
            return jsonify({"Error": "el correo electrónico al que se intenta modificar ya está en uso"}), 400
    
    try:
        if 'usNombre' in data:
            usuario.usNombre = data['usNombre']     
        if 'usApellidos' in data:
            usuario.usApellidos = data['usApellidos']
        if 'usTelefono' in data:
            usuario.usTelefono = data['usTelefono']
        if 'usPueblo' in data:
            usuario.usPueblo = data['usPueblo']
        if 'usProvincia' in data:
            usuario.usProvincia = data['usProvincia']
        if 'usDireccion' in data:
            usuario.usDireccion = data ['usDireccion']

        db.session.commit()
        return jsonify(data), 200
    
    except Exception as error:
        db.session.rollback()
        return jsonify({"Error": str(error)}), 500


# Login a la pagina y creación de token
@app.route('/login', methods = ['POST'])
def crear_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    usuarios = Usuario.query.filter_by(email = email).first()

    if usuarios is None:
        return jsonify({'Error': "No se ha encontrado el correo o contraseña"}), 404
    
    if not check_password_hash(usuarios.password, password):
        return jsonify ({'Error': 'Contraseña incorrecta'})
    
    # Se crea nuevo token de entrada del usuario a la pagina
    access_token = create_access_token(identity = usuarios.id)

    return jsonify({"token": access_token, "email":usuarios.email, "username":usuarios.username, "id": usuarios.id, "role":usuarios.role})


## -------------------------------------- >> API GOOGLE MAPS << ----------------------------------- ##


#Busca una localidad según los caracteres que introduzca el usuario
@app.route('/buscar_localidad', methods=['GET'])
def buscar_localidad():
    query = request.args.get('q')
    url = f'https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&language=es&types=locality&components=country:ES&key={googleapykey}'
    
    try:        
        response = requests.get(url)
        response.raise_for_status()  
        data = response.json()  

        # Extraer las predicciones de la respuesta
        localidades = []
        for item in data.get('predictions', []):
            place_id = item['place_id']

            provincia = detalle_localidad(place_id)

            localidades.append({
                'descripcion': item['description'],  
                'place_id': item['place_id'],    
                'provincia': provincia
            })

        
        return jsonify(localidades), 200
    except requests.exceptions.RequestException as e:        
        return jsonify({'error': str(e)}), 500
    

#Vinculada a la función anterior, devuelve la provincia según el municipio escogido
def detalle_localidad(place_id):
        url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={googleapykey}'
        respuesta = requests.get(url)
        if respuesta.status_code == 200:
            data = respuesta.json()
            address_components = data.get('result', {}).get('address_components',[])

            provincia = None
            for component in address_components:
                if 'administrative_area_level_2' in component ['types']:
                    provincia = component['long_name']
                    break

            return provincia
        else:
            print (f"Error: {respuesta.status_code}")
            return None
        




## -------------------------------------- >> ADMIN : AGENDA Y CONCIERTOS << ----------------------------------- ##

#crear evento desde perfil de administrador
@app.route('/admin/crearevento', methods=['POST'])
def crearevento():
    data = request.json

    fecha_str = data['evFecha']
    try:
        fecha = datetime.strptime(fecha_str, '%d/%m/%Y').date() 
    except ValueError:
        return jsonify({"mensaje": "formato no valido"}), 400
    
    nuevoEvento = Evento(
        evFecha = fecha,
        evPoblacion = data['evPoblacion'],
        evProvincia = data['evProvincia'],
        evLugar = data['evLugar'],
        evHora = data['evHora'],
        evEntradas = data['evEntradas'],
        evObservaciones = data['evObservaciones']
    )

    db.session.add(nuevoEvento)
    db.session.commit()

    return jsonify({
        "mensaje": "Evento creado correctamente",
        **nuevoEvento.serialize()
    }), 201



#Función para obtener todos los eventos creados
@app.route('/admin/obtenereventos', methods=['GET'])
def obtenereventos():
    todosLosEventos = Evento.query.all()
    return jsonify([evento.serialize() for evento in todosLosEventos])



# Función para editar un evento de la agenda
@app.route('/admin/editarevento/<int:evId>', methods = ['PUT'])
def editarevento(evId):
    evento = Evento.query.get(evId)

    if evento is None:
        return jsonify({"error": "el evento no se encuentra"}), 404
    
    data = request.json
    print("Datos recibidos:", data)  # Verifica qué datos recibe el backend

    if not data:
        return jsonify({"error": "no se han recibido datos"}), 400

    # Solo se actualizan los campos si están presentes en los datos recibidos
    if 'evFecha' in data:        
        try:
            fecha_str = data['evFecha']
            fecha = datetime.strptime(fecha_str, '%d/%m/%Y').date() 
            evento.evFecha = fecha
        except ValueError:
            return jsonify({"mensaje": "formato no valido"}), 400

    if 'evPoblacion' in data:
        evento.evPoblacion = data['evPoblacion']
    if 'evProvincia' in data:
        evento.evProvincia = data['evProvincia']
    if 'evLugar' in data:
        evento.evLugar = data['evLugar']
    if 'evHora' in data:
        evento.evHora = data['evHora']
    if 'evEntradas' in data:
        evento.evEntradas = data['evEntradas']
    if 'evObservaciones' in data:
        evento.evObservaciones = data['evObservaciones']

    try: 
        db.session.commit()
        fecha_formateada = evento.evFecha.strftime('%d/%m/%Y')
        return jsonify({"mensaje": "evento actualizado", "evFecha": fecha_formateada}), 200

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500


# Función para eliminar un evento de la agenda
@app.route('/admin/eliminarevento/<int:evId>', methods= ['DELETE'])
def eliminarevento(evId):
    evento = Evento.query.get(evId)
    
    if evento is None:
        return jsonify({"error": "el evento no se encuentra"}), 400
    
    try:
        db.session.delete(evento)
        db.session.commit()
        return jsonify({"mensaje": "evento borrado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)