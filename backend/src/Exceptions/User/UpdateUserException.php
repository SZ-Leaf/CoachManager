<?php

namespace App\Exceptions\User;

use RuntimeException;

final class UpdateUserException extends RuntimeException
{
   public const NOT_FOUND = 1001;
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

   public static function notFound(): self
   {
      return new self('User not found.', self::NOT_FOUND);
   }

   public static function validationFailed(array $errors): self
   {
      return new self(
         'Validation failed',
         self::VALIDATION_FAILED,
         $errors
      );
   }
}