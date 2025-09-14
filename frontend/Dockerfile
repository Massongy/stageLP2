FROM node:20-alpine

WORKDIR /app

# Copie package.json uniquement (pour installation isolée)
COPY package.json .

# Supprime node_modules et lockfile AVANT installation
RUN rm -rf node_modules package-lock.json \
    && npm cache clean --force \
    && npm install

# Puis copie le reste du projet
COPY . .

# Lancer Vite
CMD ["npm", "run", "dev"]
