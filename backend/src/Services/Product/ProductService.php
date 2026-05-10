<?php

namespace App\Services\Product;

use App\DTO\Product\CreateProductRequest;
use App\DTO\Product\UpdateProductRequest;
use App\Entity\Product;
use App\Entity\User;
use App\Exceptions\Product\CreateProductException;
use App\Exceptions\Product\UpdateProductException;
use App\Repository\ItemListRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ProductRepository $productRepository,
        private readonly ItemListRepository $itemListRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    public function create(User $coach, CreateProductRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateProductException::validationFailed(implode('; ', $errors));
        }

        $itemList = $this->itemListRepository->findOneByIdForCoach((int) $dto->itemListId, $coach);
        if ($itemList === null) {
            throw CreateProductException::itemListNotFound();
        }

        $product = new Product();
        $product->setName($dto->name);
        $product->setQuantity($dto->quantity);
        $product->setItemList($itemList);

        $this->em->persist($product);
        $this->em->flush();

        return $this->serialize($product);
    }

    public function update(User $coach, int $id, UpdateProductRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw UpdateProductException::validationFailed(implode('; ', $errors));
        }

        $product = $this->productRepository->findOneByIdForCoach($id, $coach);
        if ($product === null) {
            throw UpdateProductException::notFound();
        }

        $product->setName($dto->name);
        $product->setQuantity($dto->quantity);

        if ($dto->itemListId !== null) {
            $itemList = $this->itemListRepository->findOneByIdForCoach($dto->itemListId, $coach);
            if ($itemList === null) {
                throw UpdateProductException::itemListNotFound();
            }
            $product->setItemList($itemList);
        }

        $this->em->flush();

        return $this->serialize($product);
    }

    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (Product $p) => $this->serialize($p),
            $this->productRepository->findAllForCoach($coach)
        );
    }

    public function getForCoach(User $coach, int $id): array
    {
        $product = $this->productRepository->findOneByIdForCoach($id, $coach);
        if ($product === null) {
            throw new \InvalidArgumentException('Product not found', 404);
        }

        return $this->serialize($product);
    }

    public function delete(User $coach, int $id): void
    {
        $product = $this->productRepository->findOneByIdForCoach($id, $coach);
        if ($product === null) {
            throw new \InvalidArgumentException('Product not found', 404);
        }
        $this->em->remove($product);
        $this->em->flush();
    }

    private function serialize(Product $product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'quantity' => $product->getQuantity(),
            'itemListId' => $product->getItemList()?->getId(),
        ];
    }
}
