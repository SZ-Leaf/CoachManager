<?php

namespace App\Services\ItemList;

use App\DTO\ItemList\CreateItemListRequest;
use App\Entity\ItemList;
use App\Exceptions\ItemList\CreateItemListException;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CreateItemListService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ProductRepository $productRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws CreateItemListException
     */
    public function create(CreateItemListRequest $dto): array
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateItemListException::validationFailed(implode('; ', $errors));
        }

        $list = new ItemList();
        $list->setName($dto->name);

        if ($dto->productId !== null) {
            $product = $this->productRepository->find($dto->productId);
            if ($product === null) {
                throw CreateItemListException::productNotFound();
            }
            $list->setProduct($product);
        }

        $this->em->persist($list);
        $this->em->flush();

        return [
            'id' => $list->getId(),
            'name' => $list->getName(),
            'productId' => $list->getProduct()?->getId(),
        ];
    }
}
