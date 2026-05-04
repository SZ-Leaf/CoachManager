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
   public string $password;

   public string $avatar;
}