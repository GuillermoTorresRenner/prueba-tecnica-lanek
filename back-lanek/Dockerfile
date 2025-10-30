# Dockerfile para la API Lanek
FROM python:3.13-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requerimientos
COPY requirements.txt ./

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente
COPY . .

# Variables de entorno recomendadas
ENV FLASK_APP=src/app.py
ENV FLASK_ENV=production

# Exponer el puerto de Flask
EXPOSE 5000

# Comando para ejecutar la app
CMD ["python3", "-m", "src.app"]
