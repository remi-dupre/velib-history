# Builder

FROM node:alpine AS builder
COPY ./ .
RUN npm install
RUN npm run build

# Create compressed assets
RUN find build -type f -size +512c -regex ".*\.\(html\|css\|js\)" \
    | xargs gzip -9k

# Release

FROM nginx:stable-alpine
COPY nginx-site.conf /etc/nginx/conf.d/default.conf
COPY --from=builder build /usr/share/nginx/html
