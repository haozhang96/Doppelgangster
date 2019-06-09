FROM node:alpine
WORKDIR /doppelgangster
COPY . /doppelgangster
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]