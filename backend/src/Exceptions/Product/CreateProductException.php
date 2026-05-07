<?php

namespace App\Exceptions\Product;

use RuntimeException;

final class CreateProductException extends RuntimeException
{
    public const VALIDATION_FAILED = 2001;
    public const ITEM_LIST_NOT_FOUND = 2002;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function itemListNotFound(): self
    {
        return new self('Aucune liste ne correspond a cet identifiant', self::ITEM_LIST_NOT_FOUND);
    }
}
