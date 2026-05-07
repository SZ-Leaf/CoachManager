<?php

namespace App\DTO\Inventory;

use Symfony\Component\Validator\Constraints as Assert;

class CreateInventoryRequest
{
    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $teamId = null;
}
