from flask import Flask, jsonify, Response,  request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
from api.models import db, Usuario, Sorteo, Evento, Entrevista
from dotenv import load_dotenv
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

CORS(app)
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




@app.route('/buscar_localidad', methods=['GET'])
def buscar_localidad():
    query = request.args.get('q')
    url = f'https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&language=es&types=locality&components=country:ES&key={googleapykey}'
    
    try:
        # Hacer la solicitud a la API de Google Places
        response = requests.get(url)
        response.raise_for_status()  # Verificar si la solicitud fue exitosa
        data = response.json()  # Parsear la respuesta en formato JSON

        # Extraer las predicciones de la respuesta
        localidades = []
        for item in data.get('predictions', []):
            place_id = item['place_id']

            provincia = detalle_localidad(place_id)

            localidades.append({
                'descripcion': item['description'],  # Descripción completa de la localidad
                'place_id': item['place_id'],    # Identificador único del lugar
                'provincia': provincia
            })

        # Devolver las localidades en formato JSON
        return jsonify(localidades), 200
    except requests.exceptions.RequestException as e:
        # Manejar errores y devolver un mensaje de error
        return jsonify({'error': str(e)}), 500
    

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







if __name__ == '__main__':
    app.run(debug=True)