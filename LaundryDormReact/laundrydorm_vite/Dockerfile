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

RUN npm run build

FROM nginx:alpine 
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]

#With from nginx, we are using nginx in the final stage of our dockerfile to serve the built frontend as static website
#This tells docker: take the built frontend files (html, js, css) and copy them into nginx's default static content dir
#then use nginx to serve them over HTTP

#When we write npm run dev in vscode, we are using Vite development server, not Nginx. 
#nginx:alphine has a preinstalled Nginx web server