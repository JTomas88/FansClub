from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv()

database_url = os.getenv("DATABASE_URL")

engine = create_engine(database_url)

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT NOW();"))
        version = result.fetchone()
        print(f"Conexión exitosa a la base de datos. Hora actual: {version[0]}")
except Exception as e:
    print("Error de conexión:", e)