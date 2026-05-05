<?php

namespace App\DTO\Player;

class UpdatePlayerRequest
{
    public ?string $firstname = null;
    public ?string $lastname = null;
    public ?string $email = null;
    public ?string $phoneNumber = null;
    public ?string $emergencyName = null;
    public ?string $emergencyEmail = null;
    public ?string $emergencyPhoneNumber = null;
    public ?string $birthday = null;
    public ?string $avatar = null;
    public ?string $position = null;
    public ?string $status = null;
    public ?int $rating = null;
    public ?int $teamId = null;
}