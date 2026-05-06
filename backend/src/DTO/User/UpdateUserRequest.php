<?php

namespace App\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserRequest
{
   #[Assert\Length(min: 3, allowNull: true)]
   public ?string $firstname = null;

   #[Assert\Length(min: 3, allowNull: true)]
   public ?string $lastname = null;
   
   #[Assert\Length(min: 8, allowNull: true)]
   #[Assert\NotCompromisedPassword(
      message: 'Le mot de passe est compromis.'
   )]
   #[Assert\Regex(
      pattern: '/^(?=.*[A-Z])(?=.*\d).+$/',
      message: 'Le mot de passe doit contenir au moins une lettre majuscule et un chiffre.'
   )]
   public ?string $password = null;

   #[Assert\Length(max: 2048, allowNull: true)]
   #[Assert\Url(
      message: 'Invalid avatar URL.'
   )]
   public ?string $avatar = null;
}