#!/bin/bash
flask db upgrade  # Aplica las migraciones, si usas Flask-Migrate
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app 