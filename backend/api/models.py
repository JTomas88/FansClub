from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()


class RolUsuarioEnum(Enum):
    usuario = "usuario"
    admin = "admin"
    moderador = "moderador" 

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    usId = db.Column(db.Integer, primary_key=True)
    usEmail = db.Column(db.String(120), nullable=False)
    usPassword = db.Column(db.String(250), nullable=False)
    usUsername = db.Column(db.String(120), nullable=False)
    usNombre = db.Column(db.String(250))
    usApellidos = db.Column(db.String(250))
    usTelefono = db.Column(db.String(9))
    usProvincia = db.Column(db.String(50))
    usPueblo = db.Column(db.String(100))
    usDireccion = db.Column(db.String(200))
    usRol = db.Column(db.String(50), nullable=False, default=RolUsuarioEnum.usuario.value)

    # Relación con Sorteo a través de la tabla intermedia 'participaciones'
    sorteos = db.relationship('Sorteo', secondary='participaciones', backref='usuarios')

    def serialize(self):
        return {
            "usId": self.usId,
            "usEmail": self.usEmail,
            "usUsername": self.usUsername,
            "usNombre": self.usNombre,
            "usApellidos": self.usApellidos,
            "usTelefono": self.usTelefono,
            "usProvincia": self.usProvincia,
            "usPueblo": self.usPueblo,
            "usDireccion": self.usDireccion,
            "usRol": self.usRol
        }

# Tabla intermedia para la relación Many-to-Many entre Usuario y Sorteo
participaciones = db.Table(
    'participaciones',
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuarios.usId'), primary_key=True),
    db.Column('sorteo_id', db.Integer, db.ForeignKey('sorteos.sorId'), primary_key=True)
)

class Sorteo(db.Model):
    __tablename__ = 'sorteos'
    sorId = db.Column(db.Integer, primary_key=True)
    sorNombre = db.Column(db.String(250))
    sorDescripcion = db.Column(db.Text)
    sorFechaInicio = db.Column(db.Date)
    sorFechaFin = db.Column(db.Date)
    sorImagen = db.Column(db.String(250))
    sorResultado = db.Column(db.String(100))

    # Método para serializar el sorteo, incluyendo los participantes
    def serialize(self):
        return {
            "sorId": self.sorId,
            "sorNombre": self.sorNombre,
            "sorDescripcion": self.sorDescripcion,
            "sorFechaInicio": self.sorFechaInicio,
            "sorFechaFin": self.sorFechaFin,
            "sorImagen": self.sorImagen,
            "sorResultado": self.sorResultado,
            "participantes": [usuario.usId for usuario in self.usuarios]
        }

class Evento(db.Model):
    __tablename__ = 'eventos'
    evId = db.Column(db.Integer, primary_key=True)
    evFecha = db.Column(db.Date)
    evPoblacion = db.Column(db.String(100))
    evProvincia = db.Column(db.String(100))
    evLugar = db.Column(db.String(200))
    evHora = db.Column(db.String(10))
    evEntradas = db.Column(db.String(200))
    evObservaciones = db.Column(db.String(500))

    def serialize(self):
        return {
            "evId": self.evId,
            "evFecha": self.evFecha,
            "evPoblacion": self.evPoblacion,
            "evProvincia": self.evProvincia,
            "evLugar": self.evLugar,
            "evHora": self.evHora,
            "evEntradas": self.evEntradas,
            "evObservaciones": self.evObservaciones
        }

class Entrevista(db.Model):
    __tablename__ = 'entrevistas'
    entId = db.Column(db.Integer, primary_key=True)
    entFecha = db.Column(db.Date)
    entTitular = db.Column(db.String(250))
    entSubtitulo = db.Column(db.String(250))
    entCuerpoEntrevista = db.Column(db.Text)
    entImagen = db.Column(db.String(250))

    def serialize(self):
        return {
            "entId": self.entId,
            "entFecha": self.entFecha,
            "entTitular": self.entTitular,
            "entSubtitulo": self.entSubtitulo,
            "entCuerpoEntrevista": self.entCuerpoEntrevista,
            "entImagen": self.entImagen
        }

