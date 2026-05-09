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
        $qb = $this->createQueryBuilder('team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('coach', $coach)
            ->orderBy('team.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdAndCoach(int $id, User $coach): ?Team
    {
        $qb = $this->createQueryBuilder('team')
            ->andWhere('team.id = :id');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return $qb->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
