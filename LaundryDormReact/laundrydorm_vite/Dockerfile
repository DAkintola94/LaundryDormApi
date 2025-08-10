FROM node:22-alpine AS builder

#Create app directory
WORKDIR /app

#Copy package files first for better caching
COPY package*.json ./

#Install ALL dependencies (including dev) for building. Same as npm install?
RUN npm ci

#RUN npm install --save-dev @types/aos

#Copy source code
COPY . .

RUN npm run build -- --mode docker
#This line will make it so Vite load environment variables from .env.docker automatically during build
#It looks for docker namespace, after .evn

FROM nginx:alpine 

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"] 
# Line 22 means that means when the container starts, it runs Nginx in the foreground

#With from nginx, we are using nginx in the final stage of our dockerfile to serve the built frontend as static website
#This tells docker: take the built frontend files (html, js, css) and copy them into nginx's default static content dir
#then use nginx to serve them over HTTP

#When we write npm run dev in vscode, we are using Vite development server, not Nginx. 
#nginx:alphine has a preinstalled Nginx web server

#Your source code lives in src/
#npm run build compiles and bundles everything into dist/
#Nginx serves the static files from dist/
#The original .tsx files are not served directly — they’re transformed into optimized JS/CSS