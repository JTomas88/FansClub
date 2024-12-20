#!/bin/bash
# start.sh
flask db upgrade
flask run
export FLASK_APP=api.app  # El archivo Flask se encuentra en backend/api/app.py
export FLASK_ENV=production
export DATABASE_URL=postgresql://sienna_admin:Bp3XK6K3GfIEIDcYFPvsNo5hvH09KomD@dpg-cti8otdds78s73be20ag-a.oregon-postgres.render.com/sienna_db

# Inicia el servidor con Gunicorn
gunicorn --bind 0.0.0.0:5000 api.app:app