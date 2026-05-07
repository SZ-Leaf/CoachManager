<?php

namespace App\Repository;

use App\Entity\Team;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Team>
 */
class TeamRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Team::class);
    }

    /**
     * @return Team[]
     */
    public function findAllByCoach(User $coach): array
    {
        return $this->createQueryBuilder('team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('team.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdAndCoach(int $id, User $coach): ?Team
    {
        return $this->createQueryBuilder('team')
            ->andWhere('team.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
