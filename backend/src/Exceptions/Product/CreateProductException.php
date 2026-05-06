<?php

namespace App\Exceptions\Product;

use RuntimeException;

final class CreateProductException extends RuntimeException
{
    public const VALIDATION_FAILED = 2001;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }
}
