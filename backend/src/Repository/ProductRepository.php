<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findAllForCoach(User $coach): array
    {
        $qb = $this->createQueryBuilder('p')
            ->innerJoin('p.itemList', 'il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('coach', $coach)
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Product
    {
        $qb = $this->createQueryBuilder('p')
            ->innerJoin('p.itemList', 'il')
            ->innerJoin('il.inventory', 'inv')
            ->innerJoin('inv.team', 'team')
            ->andWhere('p.id = :id');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
