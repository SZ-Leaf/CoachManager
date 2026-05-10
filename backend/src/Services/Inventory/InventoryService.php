<?php

namespace App\Services\Inventory;

use App\DTO\Inventory\CreateInventoryRequest;
use App\Entity\Inventory;
use App\Entity\User;
use App\Exceptions\Inventory\CreateInventoryException;
use App\Repository\InventoryRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class InventoryService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TeamRepository $teamRepository,
        private readonly InventoryRepository $inventoryRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    public function create(User $coach, CreateInventoryRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreateInventoryException::validationFailed(implode('; ', $errors));
        }

        $team = $this->teamRepository->findOneByIdAndCoach((int) $dto->teamId, $coach);
        if ($team === null) {
            throw CreateInventoryException::teamNotFound();
        }
        if ($team->getInventory() !== null) {
            throw CreateInventoryException::inventoryAlreadyExists();
        }

        $now = new \DateTimeImmutable();
        $inventory = new Inventory();
        $inventory->setTeam($team);
        $inventory->setCreatedAt($now);
        $inventory->setUpdatedAt($now);

        $this->em->persist($inventory);
        $this->em->flush();

        return $this->serialize($inventory);
    }

    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (Inventory $i) => $this->serialize($i),
            $this->inventoryRepository->findAllForCoach($coach)
        );
    }

    public function getForCoach(User $coach, int $id): array
    {
        $inventory = $this->inventoryRepository->findOneByIdForCoach($id, $coach);
        if ($inventory === null) {
            throw new \InvalidArgumentException('Inventory not found', 404);
        }

        return $this->serialize($inventory);
    }

    public function touch(User $coach, int $id): array
    {
        $inventory = $this->inventoryRepository->findOneByIdForCoach($id, $coach);
        if ($inventory === null) {
            throw new \InvalidArgumentException('Inventory not found', 404);
        }
        $inventory->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->serialize($inventory);
    }

    public function delete(User $coach, int $id): void
    {
        $inventory = $this->inventoryRepository->findOneByIdForCoach($id, $coach);
        if ($inventory === null) {
            throw new \InvalidArgumentException('Inventory not found', 404);
        }

        foreach ($inventory->getItemLists() as $list) {
            foreach ($list->getProducts() as $product) {
                $this->em->remove($product);
            }
            $this->em->remove($list);
        }
        $this->em->remove($inventory);
        $this->em->flush();
    }

    private function serialize(Inventory $inventory): array
    {
        return [
            'id' => $inventory->getId(),
            'teamId' => $inventory->getTeam()?->getId(),
            'createdAt' => $inventory->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $inventory->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
