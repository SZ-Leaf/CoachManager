<?php

namespace App\Services\Product;

use App\DTO\Product\CreateProductRequest;
use App\Entity\Product;
use App\Exceptions\Product\CreateProductException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CreateProductService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws CreateProductException
     */
    public function create(CreateProductRequest $dto): array
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateProductException::validationFailed(implode('; ', $errors));
        }

        $product = new Product();
        $product->setName($dto->name);
        $product->setQuantity($dto->quantity);

        $this->em->persist($product);
        $this->em->flush();

        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'quantity' => $product->getQuantity(),
        ];
    }
}
