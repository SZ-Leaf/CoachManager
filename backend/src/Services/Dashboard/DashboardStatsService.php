<?php

namespace App\Services\Dashboard;

use App\Entity\User;
use App\Enum\AttendanceStatus;
use App\Repository\AttendanceRepository;
use App\Repository\CoachTeamAccessFilter;
use App\Repository\CommunicationRepository;
use App\Repository\PlayerRepository;
use App\Repository\TeamRepository;

class DashboardStatsService
{
    public function __construct(
        private readonly PlayerRepository $playerRepository,
        private readonly TeamRepository $teamRepository,
        private readonly CommunicationRepository $communicationRepository,
        private readonly AttendanceRepository $attendanceRepository,
    ) {
    }

    public function getCoachSummary(User $coach): array
    {
        $playersCount = $this->countPlayersForCoach($coach);
        $teamsCount = $this->countTeamsForCoach($coach);
        $messagesCount = $this->countCommunicationsForCoach($coach);
        $attendancePresentPercent = $this->attendancePresentPercentForCoach($coach);

        return [
            'playersCount' => $playersCount,
            'teamsCount' => $teamsCount,
            'messagesCount' => $messagesCount,
            'attendancePresentPercent' => $attendancePresentPercent,
        ];
    }

    private function countPlayersForCoach(User $coach): int
    {
        $qb = $this->playerRepository->createQueryBuilder('player')
            ->select('COUNT(player.id)')
            ->innerJoin('player.team', 'team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return (int) $qb->setParameter('coach', $coach)->getQuery()->getSingleScalarResult();
    }

    private function countTeamsForCoach(User $coach): int
    {
        $qb = $this->teamRepository->createQueryBuilder('team')
            ->select('COUNT(team.id)');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return (int) $qb->setParameter('coach', $coach)->getQuery()->getSingleScalarResult();
    }

    private function countCommunicationsForCoach(User $coach): int
    {
        $qb = $this->communicationRepository->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->innerJoin('c.player', 'pl')
            ->innerJoin('pl.team', 'team');
        CoachTeamAccessFilter::restrictToCoach($qb);

        return (int) $qb->setParameter('coach', $coach)->getQuery()->getSingleScalarResult();
    }

    private function attendancePresentPercentForCoach(User $coach): ?int
    {
        $qbTotal = $this->attendanceRepository->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('a.status IS NOT NULL');
        CoachTeamAccessFilter::restrictToCoach($qbTotal);

        $total = (int) $qbTotal->setParameter('coach', $coach)->getQuery()->getSingleScalarResult();

        if ($total === 0) {
            return null;
        }

        $qbPresent = $this->attendanceRepository->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->innerJoin('a.player', 'pl')
            ->innerJoin('pl.team', 'team')
            ->andWhere('a.status = :present');
        CoachTeamAccessFilter::restrictToCoach($qbPresent);

        $present = (int) $qbPresent
            ->setParameter('coach', $coach)
            ->setParameter('present', AttendanceStatus::Present)
            ->getQuery()
            ->getSingleScalarResult();

        return (int) round(100 * $present / $total);
    }
}
