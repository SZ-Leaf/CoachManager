<?php

namespace App\DTO\Product;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateProductRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $name;

    #[Assert\NotNull]
    #[Assert\PositiveOrZero]
    public ?int $quantity = null;
}
