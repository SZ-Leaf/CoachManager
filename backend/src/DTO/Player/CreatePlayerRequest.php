<?php

namespace App\DTO\Player;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePlayerRequest
{
     #[Assert\NotBlank(message: 'Firstname is required')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Firstname must contain at least {{ limit }} characters',
        maxMessage: 'Firstname cannot exceed {{ limit }} characters'
    )]
    public string $firstname = '';

    #[Assert\NotBlank(message: 'Lastname is required')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Lastname must contain at least {{ limit }} characters',
        maxMessage: 'Lastname cannot exceed {{ limit }} characters'
    )]
    public string $lastname = '';

    #[Assert\Email(message: 'Invalid email format')]
    public ?string $email = null;

    #[Assert\Length(
        max: 20,
        maxMessage: 'Phone number cannot exceed {{ limit }} characters'
    )]
    public ?string $phoneNumber = null;

    #[Assert\Length(
        min: 2,
        max: 255
    )]
    public ?string $emergencyName = null;

    #[Assert\Email(message: 'Invalid emergency email format')]
    public ?string $emergencyEmail = null;

    #[Assert\Length(
        max: 20,
        maxMessage: 'Emergency phone number cannot exceed {{ limit }} characters'
    )]
    public ?string $emergencyPhoneNumber = null;

    #[Assert\Date(message: 'Birthday must be a valid date')]
    public ?string $birthday = null;

    #[Assert\Url(message: 'Avatar must be a valid URL')]
    public ?string $avatar = null;

    #[Assert\Choice(
        choices: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'],
        message: 'Invalid player position'
    )]
    public ?string $position = null;

    #[Assert\Choice(
        choices: ['ACTIVE', 'INJURED', 'SUSPENDED'],
        message: 'Invalid player status'
    )]
    public ?string $status = null;

    #[Assert\Range(
        min: 0,
        max: 100,
        notInRangeMessage: 'Rating must be between {{ min }} and {{ max }}'
    )]
    public ?int $rating = null;

    #[Assert\Positive(message: 'Team ID must be positive')]
    public ?int $teamId = null;
}