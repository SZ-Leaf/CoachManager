# Use PHP 8.3 with Apache on Debian Bookworm (stable base image)
FROM php:8.4-apache-bookworm

# Prevent interactive prompts during package installation (critical for Docker builds)
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies + PHP extensions
RUN apt-get update \
    # Install required packages
    && apt-get install -y --no-install-recommends \
        -o Dpkg::Options::="--force-confdef" \
        -o Dpkg::Options::="--force-confold" \
        git \
        unzip \
        libicu-dev \
        libmariadb-dev \
    \
    # Configure and install PHP extensions
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" \
        intl \
        opcache \
        pdo_mysql \
    \
    # Clean up to reduce image size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable useful Apache modules (needed for Symfony)
RUN a2enmod rewrite headers

# Copy your custom Apache virtual host configuration
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Set working directory inside the container
WORKDIR /var/www/html

# Install Composer from official image (safer than curl)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy dependency files first (for Docker cache optimization)
COPY composer.json composer.lock symfony.lock ./

# Install dependencies (without dev tools or scripts yet)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader\
    --no-interaction

# Copy the rest of the application
COPY . .

# Symfony environment configuration (safe defaults for build)
ENV APP_SECRET="docker-build-placeholder-replace-at-runtime"
ENV APP_ENV=prod
ENV APP_DEBUG=0

# Finalize autoload + run Symfony scripts + fix permissions
# Pas de --classmap-authoritative : avec compose, le code est monté depuis l’hôte
# alors que vendor vient de l’image ; une classmap figée empêcherait de charger
# toute nouvelle classe PHP sans reconstruire / sans regénérer l’autoload.
RUN composer dump-autoload --optimize --no-dev \
    && composer run-script --no-dev post-install-cmd \
    && mkdir -p var/cache var/log \
    && chown -R www-data:www-data var

# Expose Apache port
EXPOSE 80

# Start Apache in foreground (required for container)
CMD ["apache2-foreground"]