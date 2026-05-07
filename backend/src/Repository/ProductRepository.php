<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * @return list<Product>
     */
    public function findAllForCoach(User $coach): array
    {
        return $this->createQueryBuilder('p')
            ->innerJoin('p.itemList', 'il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Product
    {
        return $this->createQueryBuilder('p')
            ->innerJoin('p.itemList', 'il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('p.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
