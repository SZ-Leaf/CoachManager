<?php

namespace App\Repository;

use App\Entity\Team;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;

/**
 * Accès aux ressources liées à une équipe : coach affecté à l'équipe,
 * ou coach du club lorsque l'équipe n'a pas encore de coach affecté.
 */
final class CoachTeamAccessFilter
{
    private const CLUB_ALIAS = 'clubCoachAccess';

    public static function restrictToCoach(QueryBuilder $qb, string $teamAlias = 'team'): void
    {
        $qb->leftJoin($teamAlias.'.club', self::CLUB_ALIAS)
            ->andWhere(\sprintf(
                '%1$s.coach = :coach OR (%1$s.coach IS NULL AND %2$s.coach = :coach)',
                $teamAlias,
                self::CLUB_ALIAS
            ));
    }

    public static function coachHasTeamAccess(Team $team, User $coach): bool
    {
        if ($team->getCoach()?->getId() === $coach->getId()) {
            return true;
        }

        return $team->getCoach() === null
            && $team->getClub()?->getCoach()?->getId() === $coach->getId();
    }
}
