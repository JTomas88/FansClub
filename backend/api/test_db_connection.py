import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Carga el .env que está en la misma carpeta que este script
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

database_url = os.getenv('DATABASE_URL')

print("DATABASE_URL =", database_url)  # Para verificar que se carga bien

if not database_url:
    print("No se encontró DATABASE_URL en las variables de entorno")
    exit(1)

try:
    engine = create_engine(database_url, connect_args={"sslmode": "disable"})
    with engine.connect() as connection:
        result = connection.execute("SELECT version();")
        version = result.fetchone()
        print(f"Conexión exitosa a la base de datos. Versión de PostgreSQL: {version[0]}")
except OperationalError as e:
    print(f"Error en la conexión a la base de datos:\n{e}")
