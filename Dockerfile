FROM node:23-alpine

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias y TypeScript globalmente
RUN npm install && npm install -g typescript

# Copiar el resto del código (excluye node_modules gracias a .dockerignore)
COPY . .

# Compilar TypeScript a JavaScript
RUN tsc

# Exponer el puerto
EXPOSE 3030

# Comando para iniciar el servidor
CMD ["node", "dist/index.js"]