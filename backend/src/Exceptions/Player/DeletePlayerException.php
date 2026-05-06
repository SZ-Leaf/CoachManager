<?php

namespace App\Exceptions\Player;

use RuntimeException;

final class DeletePlayerException extends RuntimeException
{
    public const PLAYER_NOT_FOUND = 4001;
    public const DELETE_FAILED = 4002;

    public static function playerNotFound(): self
    {
        return new self('Player not found', self::PLAYER_NOT_FOUND);
    }

    public static function deleteFailed(): self
    {
        return new self('Unable to delete player', self::DELETE_FAILED);
    }
}