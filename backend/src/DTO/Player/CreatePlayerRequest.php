<?php

namespace App\DTO\Player;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePlayerRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $firstname = '';

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $lastname = '';

    #[Assert\Email]
    #[Assert\Length(max: 255)]
    public ?string $email = null;

    #[Assert\Length(max: 255)]
    public ?string $phoneNumber = null;

    #[Assert\Length(max: 255)]
    public ?string $emergencyName = null;

    #[Assert\Email]
    #[Assert\Length(max: 255)]
    public ?string $emergencyEmail = null;

    #[Assert\Length(max: 255)]
    public ?string $emergencyPhoneNumber = null;
    public ?string $birthday = null;

    #[Assert\Length(max: 255)]
    public ?string $avatar = null;
    public ?string $position = null;
    public ?string $status = null;

    #[Assert\PositiveOrZero]
    public ?int $rating = null;

    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $teamId = null;
}