<?php

namespace App\Exceptions\User;

use RuntimeException;

final class RegisterUserException extends RuntimeException
{
   public const EMAIL_EXISTS = 1001;
   public const VALIDATION_FAILED = 1004;

   public function __construct(
      string $message,
      int $code,
      private readonly array $errors = []
   ) {
      parent::__construct($message, $code);
   }

   public function getErrors(): array
   {
      return $this->errors;
   }

   public static function validationFailed(array $errors): self
   {
      return new self(
         'Validation failed',
         self::VALIDATION_FAILED,
         $errors
      );
   }

   public static function emailExists(): self
   {
      return new self('L\'email existe déjà', self::EMAIL_EXISTS);
   }
}