FROM node:alpine
WORKDIR /doppelgangster_gatekeeper_frontend
COPY . /doppelgangster_gatekeeper_frontend
RUN npm install --loglevel=error
EXPOSE 80
CMD ["npm", "start"]