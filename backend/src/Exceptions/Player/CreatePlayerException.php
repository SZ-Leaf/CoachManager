<?php
namespace App\Exceptions\Player;

use RuntimeException;

final class CreatePlayerException extends RuntimeException
{
    public const VALIDATION_FAILED = 2001;
    public const TEAM_NOT_FOUND = 2002;
    public const INVALID_POSITION = 2003;
    public const INVALID_STATUS = 2004;
    public const INVALID_BIRTHDAY = 2005;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function teamNotFound(): self
    {
        return new self('Team not found', self::TEAM_NOT_FOUND);
    }

    public static function invalidPosition(): self
    {
        return new self('Invalid player position', self::INVALID_POSITION);
    }

    public static function invalidStatus(): self
    {
        return new self('Invalid player status', self::INVALID_STATUS);
    }

    public static function invalidBirthday(): self
    {
        return new self('Invalid birthday format', self::INVALID_BIRTHDAY);
    }
}