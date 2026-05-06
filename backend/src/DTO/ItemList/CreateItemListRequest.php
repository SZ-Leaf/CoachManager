<?php

namespace App\DTO\ItemList;

use Symfony\Component\Validator\Constraints as Assert;

class CreateItemListRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $name = '';

    #[Assert\Positive]
    public ?int $productId = null;
}
