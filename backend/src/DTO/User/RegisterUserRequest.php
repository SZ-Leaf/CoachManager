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
      message: 'The password is compromised.'
   )]
   #[Assert\Regex(
      pattern: '/^(?=.*[A-Z])(?=.*\d).+$/',
      message: 'The password must contain at least one uppercase letter and one number.'
   )]
   public string $password;

   #[Assert\Length(max: 2048)]
   #[Assert\Url(
      message: 'Invalid avatar URL.'
   )]
   public ?string $avatar = null;
}
