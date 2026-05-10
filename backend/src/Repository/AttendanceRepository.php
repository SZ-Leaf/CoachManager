<?php

namespace App\Repository;

use App\Entity\Attendance;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AttendanceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Attendance::class);
    }

    public function findAllForCoach(User $coach): array
    {
        $qb = $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('coach', $coach)
            ->orderBy('a.date', 'DESC')
            ->addOrderBy('a.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Attendance
    {
        $qb = $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('a.id = :id');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByTeamAndSessionForCoach(int $teamId, \DateTimeImmutable $sessionAt, User $coach): array
    {
        $qb = $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('team.id = :teamId')
            ->andWhere('a.date = :sessionAt');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('teamId', $teamId)
            ->setParameter('coach', $coach)
            ->setParameter('sessionAt', $sessionAt)
            ->getQuery()
            ->getResult();
    }

    public function findOneByPlayerAndSessionForCoach(int $playerId, \DateTimeImmutable $sessionAt, User $coach): ?Attendance
    {
        $qb = $this->createQueryBuilder('a')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('pl.id = :playerId')
            ->andWhere('a.date = :sessionAt');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('playerId', $playerId)
            ->setParameter('coach', $coach)
            ->setParameter('sessionAt', $sessionAt)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
