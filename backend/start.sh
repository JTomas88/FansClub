#!/bin/bash
# start.sh

# Asegúrate de que las migraciones de la base de datos se realicen antes de arrancar el servidor
flask db upgrade

# Asegúrate de que las variables de entorno están configuradas
export FLASK_APP=api.app  # El archivo Flask se encuentra en backend/api/app.py
export FLASK_ENV=production
export DATABASE_URL=postgresql://sienna_admin:Bp3XK6K3GfIEIDcYFPvsNo5hvH09KomD@dpg-cti8otdds78s73be20ag-a.oregon-postgres.render.com/sienna_db

# Inicia el servidor con Gunicorn (sin flask run)
gunicorn --bind 0.0.0.0:$PORT api.app:app
