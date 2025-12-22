FROM php:8.3-fpm-alpine

# Dependências do sistema + extensões PHP
RUN apk add --no-cache \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    nginx \
    bash \
    gettext \
    && docker-php-ext-install pdo_mysql zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Diretório da aplicação
WORKDIR /var/www/html

# Código da aplicação
COPY . .

# Dependências PHP (produção)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissões do Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# Nginx como template (usa $PORT do Railway)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# EXPOSE é só informativo (Railway ignora, mas mantemos padrão)
EXPOSE 8080

# Start: gera config, sobe PHP-FPM e Nginx
CMD sh -c "\
  envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf && \
  php-fpm -D && \
  nginx -g 'daemon off;'"
