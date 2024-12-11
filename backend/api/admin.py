
import os
from flask_admin import Admin
from api.models import db, Usuario, Evento, Entrevista, Sorteo
from flask_admin.contrib.sqla import ModelView

# Función que devuelve la lista de participantes
def _list_participantes(view, context, model, name):
    # Asegúrate de que se accede correctamente al campo 'usId' o 'usNombre' de los usuarios
    return ', '.join([str(usuario.usId) for usuario in model.usuarios])

# Vista personalizada para Sorteo
class SorteoView(ModelView):
    column_list = ('sorId', 'sorNombre', 'sorDescripcion', 'sorFechaInicio', 'sorFechaFin', 'participantes', 'sorResultado')
    column_labels = {
        'sorId': 'ID',
        'sorNombre': 'Nombre del Sorteo',
        'sorDescripcion': 'Descripción',
        'sorFechaInicio': 'Fecha de Inicio',
        'sorFechaFin': 'Fecha de Fin',
        'participantes': 'Lista de Participantes',
        'sorResultado': 'Resultado'
    }

    # Uso de la función de formato de columna
    column_formatters = {
        'participantes': _list_participantes
    }

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Prueba BD', template_mode='bootstrap4')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Usuario, db.session))
    admin.add_view(ModelView(Evento, db.session))
    admin.add_view(ModelView (Entrevista, db.session))
    admin.add_view(SorteoView(Sorteo, db.session))

