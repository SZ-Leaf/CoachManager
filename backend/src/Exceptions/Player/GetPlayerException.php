<?php

namespace App\Exceptions\Player;

use RuntimeException;

final class GetPlayerException extends RuntimeException
{
    public const NOT_FOUND = 5301;

    public static function notFound(): self
    {
        return new self('Aucun joueur ne correspond a cet identifiant', self::NOT_FOUND);
    }
}
