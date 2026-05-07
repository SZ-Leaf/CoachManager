<?php

namespace App\DTO\Player;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePlayerRequest
{
    #[Assert\Length(max: 255)]
    public ?string $firstname = null;

    #[Assert\Length(max: 255)]
    public ?string $lastname = null;

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

    #[Assert\Positive]
    public ?int $teamId = null;
}