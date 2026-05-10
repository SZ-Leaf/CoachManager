<?php

namespace App\Repository;

use App\Entity\Club;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ClubRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Club::class);
    }

    public function findAllForCoach(User $coach): array
    {
        return $this->createQueryBuilder('club')
            ->andWhere('club.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('club.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Club
    {
        return $this->createQueryBuilder('club')
            ->andWhere('club.id = :id')
            ->andWhere('club.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
