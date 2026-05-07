<?php

namespace App\Services\ItemList;

use App\DTO\ItemList\CreateItemListRequest;
use App\Entity\ItemList;
use App\Entity\User;
use App\Exceptions\ItemList\CreateItemListException;
use App\Repository\InventoryRepository;
use App\Repository\ItemListRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ItemListService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly InventoryRepository $inventoryRepository,
        private readonly ItemListRepository $itemListRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws CreateItemListException
     */
    public function create(User $coach, CreateItemListRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateItemListException::validationFailed(implode('; ', $errors));
        }

        $inventory = $this->inventoryRepository->findOneByIdForCoach((int) $dto->inventoryId, $coach);
        if ($inventory === null) {
            throw CreateItemListException::inventoryNotFound();
        }

        $list = new ItemList();
        $list->setName($dto->name);
        $list->setInventory($inventory);

        $this->em->persist($list);
        $this->em->flush();

        return $this->serialize($list);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (ItemList $l) => $this->serialize($l),
            $this->itemListRepository->findAllForCoach($coach)
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getForCoach(User $coach, int $id): array
    {
        $list = $this->itemListRepository->findOneByIdForCoach($id, $coach);
        if ($list === null) {
            throw new \InvalidArgumentException('Item list not found', 404);
        }

        return $this->serialize($list);
    }

    /**
     * @return array<string, mixed>
     */
    public function update(User $coach, int $id, string $name): array
    {
        $list = $this->itemListRepository->findOneByIdForCoach($id, $coach);
        if ($list === null) {
            throw new \InvalidArgumentException('Item list not found', 404);
        }
        $n = trim($name);
        if ($n === '') {
            throw new \InvalidArgumentException('Name is required', 400);
        }
        $list->setName($n);
        $this->em->flush();

        return $this->serialize($list);
    }

    public function delete(User $coach, int $id): void
    {
        $list = $this->itemListRepository->findOneByIdForCoach($id, $coach);
        if ($list === null) {
            throw new \InvalidArgumentException('Item list not found', 404);
        }
        foreach ($list->getProducts() as $product) {
            $this->em->remove($product);
        }
        $this->em->remove($list);
        $this->em->flush();
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(ItemList $list): array
    {
        return [
            'id' => $list->getId(),
            'name' => $list->getName(),
            'inventoryId' => $list->getInventory()?->getId(),
        ];
    }
}
