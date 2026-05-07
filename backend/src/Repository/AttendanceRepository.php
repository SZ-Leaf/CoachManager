<?php

namespace App\Repository;

use App\Entity\Attendance;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Attendance>
 */
class AttendanceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Attendance::class);
    }

    /**
     * @return list<Attendance>
     */
    public function findAllForCoach(User $coach): array
    {
        return $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('a.date', 'DESC')
            ->addOrderBy('a.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Attendance
    {
        return $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('a.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
