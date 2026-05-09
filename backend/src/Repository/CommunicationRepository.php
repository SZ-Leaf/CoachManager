<?php

namespace App\Repository;

use App\Entity\Communication;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Communication>
 */
class CommunicationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Communication::class);
    }

    /**
     * @return list<Communication>
     */
    public function findAllForCoach(User $coach): array
    {
        $qb = $this->createQueryBuilder('c')
            ->innerJoin('c.player', 'pl')
            ->innerJoin('pl.team', 'team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('coach', $coach)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForCoach(int $id, User $coach): ?Communication
    {
        $qb = $this->createQueryBuilder('c')
            ->innerJoin('c.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('c.id = :id');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
