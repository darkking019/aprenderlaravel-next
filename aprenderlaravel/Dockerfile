FROM php:8.3-fpm-alpine

# Instala dependências básicas
RUN apk add --no-cache \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    nginx \
    && docker-php-ext-install pdo_mysql zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissões pro Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# Copia config Nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE $PORT

CMD sh -c "php-fpm && nginx -g 'daemon off;'"