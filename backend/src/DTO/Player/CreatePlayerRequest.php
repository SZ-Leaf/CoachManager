<?php

namespace App\DTO\Player;

class CreatePlayerRequest
{
    public string $firstname = '';
    public string $lastname = '';
    public ?string $email = null;
    public ?int $phoneNumber = null;
    public ?string $emergencyName = null;
    public ?string $emergencyEmail = null;
    public ?int $emergencyPhoneNumber = null;
    public ?string $avatar = null;
    public ?int $rating = null;
}