from flask import Flask, jsonify, Response,  request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
from api.models import db, Usuario, Sorteo, Evento, Entrevista
import os
from api.admin import setup_admin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token

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













if __name__ == '__main__':
    app.run(debug=True)