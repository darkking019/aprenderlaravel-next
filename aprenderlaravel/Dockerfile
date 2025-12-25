FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    nginx \
    bash \
    libzip-dev \
    zip unzip git curl \
    && docker-php-ext-install pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
 && mkdir -p storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# configs do nginx (agora corretas)
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

RUN php artisan config:clear \
 && php artisan route:clear \
 && php artisan view:clear

CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"

