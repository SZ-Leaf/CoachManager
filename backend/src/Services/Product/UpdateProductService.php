<?php

namespace App\Services\Product;

use App\DTO\Product\UpdateProductRequest;
use App\Exceptions\Product\UpdateProductException;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UpdateProductService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ProductRepository $productRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws UpdateProductException
     */
    public function update(int $id, UpdateProductRequest $dto): array
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw UpdateProductException::validationFailed(implode('; ', $errors));
        }

        $product = $this->productRepository->find($id);
        if ($product === null) {
            throw UpdateProductException::notFound();
        }

        $product->setName($dto->name);
        $product->setQuantity($dto->quantity);

        $this->em->flush();

        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'quantity' => $product->getQuantity(),
        ];
    }
}
