<?php

namespace App\Exceptions\Player;

use RuntimeException;

final class UpdatePlayerException extends RuntimeException
{
    public const VALIDATION_FAILED = 5101;
    public const NOT_FOUND = 5102;
    public const TEAM_NOT_FOUND = 5103;
    public const TEAM_FORBIDDEN = 5104;
    public const INVALID_POSITION = 5105;
    public const INVALID_STATUS = 5106;
    public const INVALID_BIRTHDAY = 5107;

    public static function validationFailed(string $message): self
    {
        return new self($message, self::VALIDATION_FAILED);
    }

    public static function notFound(): self
    {
        return new self('Aucun joueur ne correspond a cet identifiant', self::NOT_FOUND);
    }

    public static function teamNotFound(): self
    {
        return new self('Aucune equipe ne correspond a cet identifiant', self::TEAM_NOT_FOUND);
    }

    public static function teamForbidden(): self
    {
        return new self('Vous ne pouvez pas rattacher ce joueur a une equipe non possedee', self::TEAM_FORBIDDEN);
    }

    public static function invalidPosition(): self
    {
        return new self('Position de joueur invalide', self::INVALID_POSITION);
    }

    public static function invalidStatus(): self
    {
        return new self('Statut de joueur invalide', self::INVALID_STATUS);
    }

    public static function invalidBirthday(): self
    {
        return new self('Date de naissance invalide', self::INVALID_BIRTHDAY);
    }
}
