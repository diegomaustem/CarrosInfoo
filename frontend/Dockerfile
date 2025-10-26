# Stage 1: Build da aplicação
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --silent

COPY . .

RUN npm run build --prod

# Stage 2: Servir com Nginx
FROM nginx:alpine

# COPIE OS ARQUIVOS DA SUBPASTA BROWSER PARA A RAIZ
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]