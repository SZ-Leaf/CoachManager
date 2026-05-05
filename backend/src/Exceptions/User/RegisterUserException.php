<?php

namespace App\Exceptions\User;

use RuntimeException;

final class RegisterUserException extends RuntimeException
{
   public const EMAIL_EXISTS = 1001;
   public const PASSWORD_INVALID = 1002;
   public const PASSWORD_COMPROMISED = 1003;
   public const VALIDATION_FAILED = 1004;

   public static function emailExists(): self
   {
      return new self('L\'email existe déjà', self::EMAIL_EXISTS);
   }

   public static function passwordInvalid(): self
   {
      return new self('Le mot de passe est invalide, il doit contenir au moins une lettre majuscule et un chiffre', self::PASSWORD_INVALID);
   }

   public static function passwordCompromised(): self
   {
      return new self('Le mot de passe est compromis', self::PASSWORD_COMPROMISED);
   }

   public static function validationFailed(string $message): self
   {
      return new self($message, self::VALIDATION_FAILED);
   }
}