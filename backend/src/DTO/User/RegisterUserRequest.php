<?php 

namespace App\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserRequest
{
   #[Assert\NotBlank]
   #[Assert\Length(min: 3)]
   public string $firstname;

   #[Assert\NotBlank]
   #[Assert\Length(min: 3)]
   public string $lastname;

   #[Assert\NotBlank]
   #[Assert\Email]
   public string $email;

   #[Assert\NotBlank]
   #[Assert\Length(min: 8)]
   #[Assert\NotCompromisedPassword(
      enabled: true,
      endpoint: 'https://api.pwnedpasswords.com/range/',
      message: 'Le mot de passe est compromis.'
   )]
   #[Assert\Regex(
      pattern: '/^(?=.*[A-Z])(?=.*\d).+$/',
      message: 'Le mot de passe doit contenir au moins une lettre majuscule et un chiffre.'
   )]
   public string $password;

   public ?string $avatar = null;
}