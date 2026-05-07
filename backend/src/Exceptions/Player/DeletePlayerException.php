<?php

namespace App\Exceptions\Player;

use RuntimeException;

final class DeletePlayerException extends RuntimeException
{
    public const NOT_FOUND = 5201;
    public const DELETE_BLOCKED = 5202;

    public static function notFound(): self
    {
        return new self('Aucun joueur ne correspond a cet identifiant', self::NOT_FOUND);
    }

    public static function deleteBlocked(): self
    {
        return new self('Suppression impossible: ce joueur possede des presences ou communications', self::DELETE_BLOCKED);
    }
}
