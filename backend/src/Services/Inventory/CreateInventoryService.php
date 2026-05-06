<?php

namespace App\Services\Inventory;

use App\DTO\Inventory\CreateInventoryRequest;
use App\Entity\Inventory;
use App\Exceptions\Inventory\CreateInventoryException;
use App\Repository\ItemListRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CreateInventoryService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ItemListRepository $itemListRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws CreateInventoryException
     */
    public function create(CreateInventoryRequest $dto): array
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateInventoryException::validationFailed(implode('; ', $errors));
        }

        $list = $this->itemListRepository->find($dto->listId);
        if ($list === null) {
            throw CreateInventoryException::listNotFound();
        }

        $now = new \DateTimeImmutable();
        $inventory = new Inventory();
        $inventory->setList($list);
        $inventory->setCreatedAt($now);
        $inventory->setUpdatedAt($now);

        $this->em->persist($inventory);
        $this->em->flush();

        return [
            'id' => $inventory->getId(),
            'listId' => $list->getId(),
            'createdAt' => $inventory->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $inventory->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
