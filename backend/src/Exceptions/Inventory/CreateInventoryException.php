<?php

namespace App\Exceptions\Inventory;

use RuntimeException;

final class CreateInventoryException extends RuntimeException
{
    public const VALIDATION_FAILED = 3001;
    public const TEAM_NOT_FOUND = 3002;
    public const INVENTORY_EXISTS = 3003;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function teamNotFound(): self
    {
        return new self('Aucune equipe ne correspond a cet identifiant', self::TEAM_NOT_FOUND);
    }

    public static function inventoryAlreadyExists(): self
    {
        return new self('This team already has an inventory', self::INVENTORY_EXISTS);
    }
}
