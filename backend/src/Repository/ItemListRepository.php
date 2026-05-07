<?php

namespace App\Repository;

use App\Entity\ItemList;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ItemList>
 */
class ItemListRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ItemList::class);
    }

    /**
     * @return list<ItemList>
     */
    public function findAllForCoach(User $coach): array
    {
        return $this->createQueryBuilder('il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('il.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?ItemList
    {
        return $this->createQueryBuilder('il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('il.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
