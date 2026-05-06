<?php

namespace App\Exceptions\Player;

use RuntimeException;

final class UpdatePlayerException extends RuntimeException
{
    public const PLAYER_NOT_FOUND = 3001;
    public const VALIDATION_FAILED = 3002;
    public const TEAM_NOT_FOUND = 3003;
    public const INVALID_POSITION = 3004;
    public const INVALID_STATUS = 3005;
    public const INVALID_BIRTHDAY = 3006;

    public static function playerNotFound(): self
    {
        return new self(
            'Player not found',
            self::PLAYER_NOT_FOUND
        );
    }

    public static function validationFailed(string $message): self
    {
        return new self(
            $message,
            self::VALIDATION_FAILED
        );
    }

    public static function teamNotFound(): self
    {
        return new self(
            'Team not found',
            self::TEAM_NOT_FOUND
        );
    }

    public static function invalidPosition(): self
    {
        return new self(
            'Invalid player position',
            self::INVALID_POSITION
        );
    }

    public static function invalidStatus(): self
    {
        return new self(
            'Invalid player status',
            self::INVALID_STATUS
        );
    }

    public static function invalidBirthday(): self
    {
        return new self(
            'Invalid birthday format',
            self::INVALID_BIRTHDAY
        );
    }
}