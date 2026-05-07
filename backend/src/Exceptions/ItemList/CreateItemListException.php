<?php

namespace App\Exceptions\ItemList;

use RuntimeException;

final class CreateItemListException extends RuntimeException
{
    public const VALIDATION_FAILED = 4001;
    public const INVENTORY_NOT_FOUND = 4002;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function inventoryNotFound(): self
    {
        return new self('Aucun inventaire ne correspond a cet identifiant', self::INVENTORY_NOT_FOUND);
    }
}
