<?php

namespace App\Exceptions\Product;

use RuntimeException;

final class UpdateProductException extends RuntimeException
{
    public const VALIDATION_FAILED = 2011;
    public const NOT_FOUND = 2012;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function notFound(): self
    {
        return new self('Aucun produit ne correspond à cet identifiant', self::NOT_FOUND);
    }
}
