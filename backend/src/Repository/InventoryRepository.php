<?php

namespace App\Repository;

use App\Entity\Inventory;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Inventory>
 */
class InventoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Inventory::class);
    }

    /**
     * @return list<Inventory>
     */
    public function findAllForCoach(User $coach): array
    {
        return $this->createQueryBuilder('inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('inv.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Inventory
    {
        return $this->createQueryBuilder('inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('inv.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
