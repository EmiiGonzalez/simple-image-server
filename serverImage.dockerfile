FROM node:22.9-alpine

WORKDIR /usr/src/app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm install
RUN npm install -g typescript

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN tsc

# Exponer el puerto
EXPOSE 3030

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]