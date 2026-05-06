<?php

namespace App\DTO\Player;

use Symfony\Component\Validator\Constraints as Assert;


class UpdatePlayerRequest
{
    #[Assert\Length(min: 2, max: 255)]
    public ?string $firstname = null;

    #[Assert\Length(min: 2, max: 255)]
    public ?string $lastname = null;

    #[Assert\Email]
    public ?string $email = null;

    #[Assert\Length(max: 20)]
    public ?string $phoneNumber = null;

    #[Assert\Length(min: 2, max: 255)]
    public ?string $emergencyName = null;

    #[Assert\Email]
    public ?string $emergencyEmail = null;

    #[Assert\Length(max: 20)]
    public ?string $emergencyPhoneNumber = null;

    #[Assert\Date]
    public ?string $birthday = null;

    #[Assert\Url]
    public ?string $avatar = null;

    #[Assert\Choice(
        choices: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD']
    )]
    public ?string $position = null;

    #[Assert\Choice(
        choices: ['ACTIVE', 'INJURED', 'SUSPENDED']
    )]
    public ?string $status = null;

    #[Assert\Range(min: 0, max: 100)]
    public ?int $rating = null;

    #[Assert\Positive]
    public ?int $teamId = null;
}