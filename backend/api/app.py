from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
from api.models import db, Usuario, Sorteo, Evento, Entrevista
import os
from api.admin import setup_admin

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

if __name__ == '__main__':
    app.run(debug=True)