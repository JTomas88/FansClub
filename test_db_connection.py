import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Carga el .env desde la carpeta raíz del proyecto (ajusta según tu estructura)
load_dotenv()

database_url = os.getenv('DATABASE_URL')

if not database_url:
    print("No se encontró DATABASE_URL en las variables de entorno")
    exit(1)

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute("SELECT version();")
        version = result.fetchone()
        print(f"Conexión exitosa a la base de datos. Versión de PostgreSQL: {version[0]}")
except OperationalError as e:
    print(f"Error en la conexión a la base de datos:\n{e}")
