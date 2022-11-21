FROM node:alpine AS builder
COPY ./ .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY nginx-site.conf /etc/nginx/conf.d/default.conf
COPY --from=builder build /usr/share/nginx/html
