from flask import Flask, jsonify, Response,  request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
from api.models import db, Usuario, Sorteo, Evento, Entrevista
from dotenv import load_dotenv
from datetime import datetime
from api.admin import setup_admin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token
import os
import requests
import cloudinary
import cloudinary.api
import cloudinary.uploader
import json

# Cargar el archivo .env
load_dotenv()

# Acceder a la variable de entorno 'GOOGLE_API_KEY'
googleapykey=os.getenv('GOOGLE_API_KEY')

# Configurar Cloudinary
cloudinary.config(
    cloudinary_url=os.getenv('CLOUDINARY_URL')
)

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
    

    usuarios = Usuario.query.filter_by(usEmail = email).first()
    print ('usuario: ', usuarios)

    if usuarios is None:
        return jsonify({'Error': "No se ha encontrado el correo o contraseña"}), 404
    
    if not check_password_hash(usuarios.usPassword, password):
        return jsonify ({'Error': 'Contraseña incorrecta'})
    
    # Se crea nuevo token de entrada del usuario a la pagina
    access_token = create_access_token(identity = usuarios.usId)

    return jsonify({"token": access_token, "email":usuarios.usEmail, "username":usuarios.usUsername, "id": usuarios.usId, "rol":usuarios.usRol})


# #Verificar si la contraseña actual es la correcta
@app.route('/verificarpwactual', methods=['POST'])
def verificarpwactual():
    email = request.json.get("email")
    password = request.json.get("password")
    
    print(f"Email: {email}")
    print(f"Password ingresada: {password}")

    usuario = Usuario.query.filter_by(usEmail=email).first()

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    print(f"Hash de contraseña almacenada: {usuario.usPassword}")
    
    # Verificación correcta del hash
    if check_password_hash(usuario.usPassword, password):
        return jsonify({'isValid': True}), 200
    else:
        return jsonify({'isValid': False}), 401

    


# Cambio de contraseña desde perfil del usuario
@app.route('/users/cambiopassword/<int:usId>', methods=['PUT'])
def cambiopassword(usId):
    usuario = Usuario.query.get(usId)
    
    if usuario is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    # Obtener la nueva contraseña del cuerpo de la solicitud
    data = request.json
    nueva_password = data.get('password')
    
    if not nueva_password:
        return jsonify({"error": "La nueva contraseña es requerida"}), 400

    # Hashear la nueva contraseña
    nueva_password_hash = generate_password_hash(nueva_password)

    # Sobrescribir la contraseña antigua con la nueva hasheada
    usuario.usPassword = nueva_password_hash

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({"mensaje": "Contraseña actualizada con éxito"}), 200


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



## -------------------------------------- >> ADMIN : GESTION USUARIOS << ----------------------------------- ##

# Editar rol desde perfil de administrador
@app.route('/admin/editar/<int:usId>', methods = ['PUT'])
def admin_editar_rol_(usId):
    usuario = Usuario.query.get(usId)

    if usuario is None:
        return jsonify({"Error": "No existe el usuario"}), 400
    
    data = request.json 

    try:
        if 'rol' in data: 
            usuario.usRol = data['rol']
        
        db.session.commit()

        return jsonify({"id": usuario.id, "rol":usuario.usRol}), 200

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500
    

#Eliminar un usuario desde perfil de administrador
@app.route('/admin/eliminarusuario/<int:usId>', methods = ['DELETE'])
def admin_eliminar_usuario_(usId):
    usuario = Usuario.query.get(usId)

    if usuario is None:
        return jsonify({"Error": "No existe el usuario"}), 400

    try: 
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"Mensaje": "Usuario borrado correctamente"}), 200

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500
    


## -------------------------------------- >> ADMIN : GESTION DE GALERIAS << ----------------------------------- ##

#Crear nueva carpeta de imágenes desde perfil de administrador
@app.route('/admin/crearcarpeta', methods=['POST'])
def crearCarpeta():
    nombre_carpeta = request.form.get('folder')

    if nombre_carpeta:
        upload =  cloudinary.api.create_folder(nombre_carpeta) 
        return jsonify(upload)

    return jsonify({"error": "error al crear carpeta"}), 400


#Recuperar las carpetas desde cloudinary y mostrarlas en elfront
@app.route('/admin/mostrarcarpetas', methods=['GET'])
def mostrarCarpetas():
    try:
        recursos = cloudinary.api.subfolders('')
        print("Recursos obtenidos desde cloudinary:", recursos)
        return jsonify(recursos['folders'])
    except Exception as e:
        print("Error al obtener carpetas:", str(e))
        return jsonify({"error": str(e)}), 500
    

#Subir foto para importar a cloudinary
@app.route('/admin/subirfoto', methods=['POST'])
def subirfoto():
    archivos_imagen = request.files.getlist('files')
    nombre_carpeta = request.form.get('folder')

    if archivos_imagen and nombre_carpeta:
        urls = []
        for archivo in archivos_imagen:
            upload = cloudinary.uploader.upload(archivo, folder=nombre_carpeta)
            urls.append(upload['secure_url'])

        return jsonify({"urls": urls})
    
    return jsonify({"error": "no se han subido correctamente los archivos"}), 400


## -------------------------------------- >> ADMIN : GESTION ENTREVISTAS<< ----------------------------------- ##

# Función para agregar una ENTREVISTA desde el perfil de administrador
@app.route('/admin/crearentrevista', methods = ['POST'])
def crearentrevista():
    data = request.json

    fecha_str = data['fecha']
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"mensaje": "formato no valido"}), 400
    
    nuevaEntrevista = Entrevista(
        entFecha = fecha,
        entTitular = data['titular'],
        entSubtitulo = data['subtitulo'],
        entCuerpoEntrevista = data['cuerpo'],
        entImagen = data['imagen'],
    )

    db.session.add(nuevaEntrevista)
    db.session.commit()

    return jsonify ({
        "mensaje": "Entrevista creada correctamente",
        **nuevaEntrevista.serialize()
    }), 201


#Función para editar una entrevista
@app.route('/admin/editarentrevista/<int:entrevista_id>', methods = ['PUT'])
def editarentrevista (entrevista_id):
    entrevista = Entrevista.query.get(entrevista_id)
    if entrevista is None:
        return jsonify({"error": "la entrevista no se encuentra"}), 404
    
    data = request.json
    print ("Entrevista", data)

    fecha_str = data['fecha']
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify ({"mensaje": "formato no valido"}), 400
    
    if not data:
        return jsonify({"error": "no se han recibido los datos de la entrevista"}), 400
    
    try:
        if 'fecha' in data:
            entrevista.entFecha = fecha
        if 'titular' in data:
            entrevista.entTitular = data['titular']
        if 'subtitulo' in data:
            entrevista.entSubtitulo = data['subtitulo']
        if 'cuerpo' in data:
            entrevista.entCuerpoEntrevista = data['cuerpo']
        if 'imagen' in data:
            #Almacena la lista de imagenes en un string de formato Json.
            entrevista.entImagen = json.dumps(data['imagen']) if isinstance(data['imagen'], list) else data['imagen']

        db.session.commit()
        return jsonify({"mensaje": "entrevista actualizada"}), 200
    
    except Exception as error:
        db.session.rollback()
        return jsonify ({"Error": str(error)}), 500
    

#Función para obtener todas las entrevistas guardadas
@app.route ('/admin/obtenerentrevistas', methods = ['GET'])
def obtenerentrevistas():
    entrevistas = Entrevista.query.all()
    return jsonify([entrevista.serialize() for entrevista in entrevistas])


#Función para obtener una entrevista por su ID
@app.route('/admin/obtenerentrevista/<int:id>', methods=['GET'])
def obtenerEntrevistaPorId(entId):
    entrevista = Entrevista.query.get(entId)
    if entrevista is None:
        return jsonify({"Error": "entrevista no encontrada"}), 404
    
    return jsonify(entrevista.serialize())


#Función para borrar la foto de una entrevista
@app.route('/admin/elimfotoentrev/<string:id>', methods = ['DELETE'])
def elimfotoentrev(id):
    if id is None:
        return jsonify ({"Error": "no se encuentra la foto"})
    
    try:
        borrado = cloudinary.uploader.destroy(id)

        if borrado.get('result') == 'ok':
            return jsonify ({"Mensaje": "la foto se ha borrado correctamente"})
        else:
            return jsonify({"Error": "la foto no se ha podido borrar"})
        
    except Exception as error:
        return jsonify({"error": str(error)})
    

# Función para subir fotos a las entrevistas
@app.route('/admin/subirfoto_entrevista', methods=['POST'])
def subirfoto_entrevista():
    fotos = request.files.getlist('files')
    if fotos:
        urls = []
        for foto in fotos:
            upload = cloudinary.uploader.upload(foto)
            urls.append(upload['secure_url'])
        
        return jsonify({"urls": urls})
    
    return jsonify({"error": "no se han subido las fotos a la entrevista"})


# FUnción para borrar una entrevista por id
@app.route('/admin/eliminarentrevista/<int:entId>', methods = ['DELETE'])
def eliminarEntrevista(entId):
    entrevista = Entrevista.query.get(entId)

    if entrevista is None:
        return jsonify({"error": "no se encuentra la entrevista"}), 400
    
    try:
        db.session.delete(entrevista)
        db.session.commit()
        return jsonify ({"Mensaje": "entrevista borrada correctamente"}), 200
    except Exception as Error:
        db.session.rollback()
        return jsonify({"Error": str(Error)}), 500
    

    ## -------------------------------------- >> ADMIN : GESTION SORTEOS<< ----------------------------------- //

#Función para creae un sorteo nuevo
@app.route('/admin/crearsorteo', methods = ['POST'])
def crearSorteo():
    data = request.json

    try:
        fechaInicio = datetime.strptime(data['inicioSorteo'], '%d/%m/%Y').date()
        fechaFin = datetime.strptime(data['finSorteo'], '%d/%m/%Y').date()
    except (KeyError, ValueError):
        return jsonify({"mensaje": "Formato de fecha no válido"}), 400
    
    nuevoSorteo = Sorteo(
        sorNombre = data['nombreSorteo'],
        sorDescripcion = data['descripcionSorteo'],
        sorFechaInicio = fechaInicio,
        sorFechaFin = fechaFin,
        sorImagen = data['imagenSorteo'],
    )

    db.session.add(nuevoSorteo)
    db.session.commit()

    return jsonify({
        "mensaje": "Sorteo creado correctamente",
        **nuevoSorteo.serialize()
    }), 201


#Función para editar un sorteo
@app.route('/admin/editarsorteo/<int:sorId>', methods = ['PUT'])
def editarSorteo(sorId):
    sorteo = Sorteo.query.get(sorId)
    if sorteo is None:
        return jsonify({"mensaje": "el sorteo no se encuentra"}), 404
    
    data = request.json
    print('Sorteo: ', data)

    if not data:
        return jsonify({"mensaje": "no se han recibido los datos"}), 400
    
    fecha_inicio = data['fechaInicio']
    fecha_fin = data['fechaFin']
    try:       
        fechaInicio = datetime.strptime(fecha_inicio,  '%Y-%m-%d').date()
        fechaFin = datetime.strptime(fecha_fin,  '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"mensaje": "Formato de fecha no válido"}), 400

    try:
        if 'nombre' in data:
            sorteo.sorNombre = data['nombre']
        if 'descripcion' in data:
            sorteo.sorDescripcion = data['descripcion']
        if 'fechaInicio' in data:
            sorteo.sorFechaInicio = fechaInicio
        if 'fechaFin' in data:
            sorteo.sorFechaFin = fechaFin    
        if 'imagen' in data:
            sorteo.sorImagen = data['imagen']
    
        db.session.commit()
        return jsonify({"mensaje": "Sorteo editado correctamente"}), 200
    
    except Exception as error:
        db.session.rollback()
        return jsonify ({"Error": str(error)}), 500

#Función para obtener todos los sorteos
@app.route ('/admin/obtenersorteos', methods = ['GET'])
def obtenersorteos():
    sorteos = Sorteo.query.all()
    return jsonify([sorteo.serialize() for sorteo in sorteos])



# FUnción para borrar un sorteo por id
@app.route('/admin/eliminarsorteo/<int:sorId>', methods = ['DELETE'])
def eliminarSorteo(sorId):
    sorteo = Sorteo.query.get(sorId)

    if sorteo is None:
        return jsonify({"error": "no se encuentra el sorteo"}), 400
    
    try:
        db.session.delete(sorteo)
        db.session.commit()
        return jsonify ({"Mensaje": "sorteo borrado correctamente"}), 200
    except Exception as Error:
        db.session.rollback()
        return jsonify({"Error": str(Error)}), 500
    
@app.route('/resultado/<int:sorId>', methods = ['POST'])
def anadirResultado(sorId):
    sorteo = Sorteo.query.get(sorId)
    data = request.json
    id_ganador = data.get('id')

    if not sorteo:
        return jsonify({"message": "Sorteo no encontrado"}), 404
    
    user = Usuario.query.get(id_ganador)
    if user:
        sorteo.sorResultado = user.usId
        db.session.commit()
        return jsonify({"message": "Ganador guardado con exito"}), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404


## -------------------------------------- >> SORTEOS - VISTA USUARIO-<< ----------------------------------- ##   

@app.route('/participar/<int:sorteo_id>', methods=['POST'])
def participar_en_sorteo(sorteo_id):
    
    sorteo = Sorteo.query.get(sorteo_id)
    data = request.json
    print('Datos del participante: ', data)
    id_participante = data.get('id')

    if not sorteo:
        return jsonify({"message": "Sorteo no encontrado"}), 404

    if id_participante in [usuario.usId for usuario in sorteo.usuarios]:
        return jsonify({"message": "Ya estás participando en este sorteo"}), 400

    user = Usuario.query.get(id_participante)
    if user:
        sorteo.usuarios.append(user)
        db.session.commit()
        return jsonify({"message": "Participación registrada con éxito"}), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404
    









## -------------------------------------- >> VISOR DE FOTOS POR CARPETA<< ----------------------------------- ##

#Mostrar el contenido de las carpetas de cloudinary
@app.route ('/admin/mostrarImagenesCarpetas/<string:nombreCarpeta>', methods=['GET'])
def mostrarImagenesCarpeta(nombreCarpeta):
    try:
        recursos = cloudinary.api.resources(
            type="upload",
            prefix=nombreCarpeta + '/',
            max_results=100
        )
        archivos = recursos.get('resources', [])
        return archivos
    except cloudinary.exceptions.Error as e:
        print (f"Error al obtener el contenido de la carpeta: {e}")
        return None













if __name__ == '__main__':
    app.run(debug=True)