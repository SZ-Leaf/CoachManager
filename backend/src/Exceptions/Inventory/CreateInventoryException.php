<?php

namespace App\Exceptions\Inventory;

use RuntimeException;

final class CreateInventoryException extends RuntimeException
{
    public const VALIDATION_FAILED = 3001;
    public const LIST_NOT_FOUND = 3002;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function listNotFound(): self
    {
        return new self('Aucune liste ne correspond à cet identifiant', self::LIST_NOT_FOUND);
    }
}
