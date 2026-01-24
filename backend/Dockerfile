# immagine Node LTS
FROM node:20-alpine

# directory di lavoro
WORKDIR /app

# copia package.json
COPY package*.json ./

# install dipendenze
RUN npm install --production

# copia il resto del progetto
COPY . .

# porta esposta
EXPOSE 3215

# avvio app
CMD ["npm", "start"]