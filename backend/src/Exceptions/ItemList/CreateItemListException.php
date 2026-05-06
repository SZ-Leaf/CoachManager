<?php

namespace App\Exceptions\ItemList;

use RuntimeException;

final class CreateItemListException extends RuntimeException
{
    public const VALIDATION_FAILED = 4001;
    public const PRODUCT_NOT_FOUND = 4002;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function productNotFound(): self
    {
        return new self('Aucun produit ne correspond à cet identifiant', self::PRODUCT_NOT_FOUND);
    }
}
