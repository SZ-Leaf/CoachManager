FROM php:8.2-apache-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libicu-dev \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" intl opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite headers

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .

# Required so Composer / Symfony scripts during image build do not fail on empty APP_SECRET
ENV APP_SECRET="docker-build-placeholder-replace-at-runtime"

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && composer run-script --no-dev post-install-cmd \
    && mkdir -p var/cache var/log \
    && chown -R www-data:www-data var

ENV APP_ENV=prod
ENV APP_DEBUG=0
# Override APP_SECRET at runtime (e.g. in compose.yaml or your orchestrator)

EXPOSE 80

CMD ["apache2-foreground"]
