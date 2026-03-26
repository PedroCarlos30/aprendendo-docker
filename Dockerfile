# Estágio 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e compila
COPY . .
RUN npm run build

# Estágio 2: Serve (Produção)
FROM nginx:stable-alpine

# Copia os arquivos compilados do estágio anterior para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
