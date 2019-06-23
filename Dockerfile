FROM node:alpine
WORKDIR /doppelgangster
COPY . /doppelgangster
RUN npm install --loglevel=error
EXPOSE 3000
CMD ["npm", "start"]