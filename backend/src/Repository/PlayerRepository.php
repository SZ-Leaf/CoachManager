<?php

namespace App\Repository;

use App\Entity\Player;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Player>
 */
class PlayerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Player::class);
    }

    /**
     * @return Player[]
     */
    public function findAllByCoach(User $coach): array
    {
        return $this->createQueryBuilder('player')
            ->innerJoin('player.team', 'team')
            ->andWhere('team.coach = :coach')
            ->setParameter('coach', $coach)
            ->orderBy('player.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdAndCoach(int $id, User $coach): ?Player
    {
        return $this->createQueryBuilder('player')
            ->innerJoin('player.team', 'team')
            ->andWhere('player.id = :id')
            ->andWhere('team.coach = :coach')
            ->setParameter('id', $id)
            ->setParameter('coach', $coach)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return Player[] Returns an array of Player objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Player
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
