# --- build stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# get build-time values from compose/CI
ARG VITE_API_URL
ARG VITE_MAPBOX_TOKEN

COPY package*.json ./
RUN npm ci
COPY . .

# ensure Vite picks them up at build time
RUN printf "VITE_API_URL=%s\nVITE_MAPBOX_TOKEN=%s\n" "$VITE_API_URL" "$VITE_MAPBOX_TOKEN" > .env.production

RUN npm run build

# --- serve stage ---
FROM nginx:alpine

ENV PORT=80

COPY --from=builder /app/dist /usr/share/nginx/html

# put template somewhere explicit
RUN printf 'server {\n\
  listen       ${PORT};\n\
  listen       [::]:${PORT};\n\
  server_name  _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / { try_files $uri $uri/ /index.html; }\n\
}\n' > /etc/nginx/conf.d/default.conf.template


# explicitly render template -> config at container start
CMD ["/bin/sh", "-lc", "envsubst '$$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

