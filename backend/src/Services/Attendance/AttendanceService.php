<?php

namespace App\Services\Attendance;

use App\Entity\Attendance;
use App\Entity\User;
use App\Enum\AttendanceStatus;
use App\Repository\AttendanceRepository;
use App\Repository\PlayerRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;

class AttendanceService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly AttendanceRepository $attendanceRepository,
        private readonly PlayerRepository $playerRepository,
        private readonly TeamRepository $teamRepository,
    ) {
    }

    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (Attendance $a) => $this->serialize($a),
            $this->attendanceRepository->findAllForCoach($coach)
        );
    }

    public function getForCoach(User $coach, int $id): array
    {
        $a = $this->attendanceRepository->findOneByIdForCoach($id, $coach);
        if ($a === null) {
            throw new \InvalidArgumentException('Attendance not found', 404);
        }

        return $this->serialize($a);
    }

    public function create(User $coach, array $data): array
    {
        $playerId = (int) ($data['playerId'] ?? 0);
        if ($playerId < 1) {
            throw new \InvalidArgumentException('playerId is required', 400);
        }
        $player = $this->playerRepository->findOneByIdAndCoach($playerId, $coach);
        if ($player === null) {
            throw new \InvalidArgumentException('Player not found', 404);
        }

        $now = new \DateTimeImmutable();
        $a = new Attendance();
        $a->setPlayer($player);
        $a->setDate(!empty($data['date']) ? new \DateTimeImmutable((string) $data['date']) : null);
        $a->setStatus(!empty($data['status']) ? AttendanceStatus::from((string) $data['status']) : null);
        $a->setComment(isset($data['comment']) ? (string) $data['comment'] : null);
        $a->setCreatedAt($now);
        $a->setUpdatedAt($now);

        $this->em->persist($a);
        $this->em->flush();

        return $this->serialize($a);
    }

    public function update(User $coach, int $id, array $data): array
    {
        $a = $this->attendanceRepository->findOneByIdForCoach($id, $coach);
        if ($a === null) {
            throw new \InvalidArgumentException('Attendance not found', 404);
        }

        if (\array_key_exists('playerId', $data) && $data['playerId'] !== null) {
            $pid = (int) $data['playerId'];
            $player = $this->playerRepository->findOneByIdAndCoach($pid, $coach);
            if ($player === null) {
                throw new \InvalidArgumentException('Player not found', 404);
            }
            $a->setPlayer($player);
        }
        if (\array_key_exists('date', $data)) {
            $a->setDate(!empty($data['date']) ? new \DateTimeImmutable((string) $data['date']) : null);
        }
        if (\array_key_exists('status', $data)) {
            $a->setStatus(!empty($data['status']) ? AttendanceStatus::from((string) $data['status']) : null);
        }
        if (\array_key_exists('comment', $data)) {
            $a->setComment($data['comment'] !== null ? (string) $data['comment'] : null);
        }

        $a->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->serialize($a);
    }

    public function delete(User $coach, int $id): void
    {
        $a = $this->attendanceRepository->findOneByIdForCoach($id, $coach);
        if ($a === null) {
            throw new \InvalidArgumentException('Attendance not found', 404);
        }
        $this->em->remove($a);
        $this->em->flush();
    }

    public function getTeamRollCallForCoach(User $coach, int $teamId, string $sessionAtIso): array
    {
        $team = $this->teamRepository->findOneByIdAndCoach($teamId, $coach);
        if ($team === null) {
            throw new \InvalidArgumentException('Team not found', 404);
        }
        try {
            $sessionAt = new \DateTimeImmutable($sessionAtIso);
        } catch (\Exception) {
            throw new \InvalidArgumentException('Invalid sessionAt', 400);
        }

        $players = $this->playerRepository->findAllByTeamIdAndCoach($teamId, $coach);
        $attendances = $this->attendanceRepository->findByTeamAndSessionForCoach($teamId, $sessionAt, $coach);
        $byPlayerId = [];
        foreach ($attendances as $a) {
            $pid = $a->getPlayer()?->getId();
            if ($pid !== null) {
                $byPlayerId[$pid] = $a;
            }
        }

        $rows = [];
        foreach ($players as $p) {
            $a = $byPlayerId[$p->getId()] ?? null;
            $rows[] = [
                'playerId' => $p->getId(),
                'firstname' => $p->getFirstname(),
                'lastname' => $p->getLastname(),
                'position' => $p->getPosition()?->value,
                'status' => $a?->getStatus()?->value,
                'attendanceId' => $a?->getId(),
            ];
        }

        return [
            'sessionAt' => $sessionAt->format(\DateTimeInterface::ATOM),
            'teamId' => $teamId,
            'players' => $rows,
        ];
    }

    public function saveTeamRollCall(User $coach, int $teamId, array $data): array
    {
        $team = $this->teamRepository->findOneByIdAndCoach($teamId, $coach);
        if ($team === null) {
            throw new \InvalidArgumentException('Team not found', 404);
        }

        $sessionAtIso = trim((string) ($data['sessionAt'] ?? ''));
        if ($sessionAtIso === '') {
            throw new \InvalidArgumentException('sessionAt is required', 400);
        }
        try {
            $sessionAt = new \DateTimeImmutable($sessionAtIso);
        } catch (\Exception) {
            throw new \InvalidArgumentException('Invalid sessionAt', 400);
        }

        $entries = $data['entries'] ?? [];
        if (!\is_array($entries)) {
            throw new \InvalidArgumentException('entries must be an array', 400);
        }

        $players = $this->playerRepository->findAllByTeamIdAndCoach($teamId, $coach);
        $allowedIds = [];
        foreach ($players as $p) {
            $allowedIds[$p->getId()] = true;
        }

        $statusByPlayer = [];
        foreach ($entries as $entry) {
            if (!\is_array($entry)) {
                throw new \InvalidArgumentException('Invalid entry', 400);
            }
            $playerId = (int) ($entry['playerId'] ?? 0);
            $statusStr = isset($entry['status']) ? trim((string) $entry['status']) : '';
            if ($playerId < 1 || !isset($allowedIds[$playerId])) {
                throw new \InvalidArgumentException('Invalid player for this team', 400);
            }
            if ($statusStr === '') {
                $statusByPlayer[$playerId] = AttendanceStatus::Absent;

                continue;
            }
            try {
                $statusByPlayer[$playerId] = AttendanceStatus::from($statusStr);
            } catch (\ValueError $e) {
                throw new \InvalidArgumentException('Invalid status value', 400);
            }
        }

        $now = new \DateTimeImmutable();
        foreach ($players as $player) {
            $pid = $player->getId();
            if ($pid === null) {
                continue;
            }
            $status = $statusByPlayer[$pid] ?? AttendanceStatus::Absent;

            $existing = $this->attendanceRepository->findOneByPlayerAndSessionForCoach($pid, $sessionAt, $coach);
            if ($existing !== null) {
                $existing->setStatus($status);
                $existing->setUpdatedAt($now);
            } else {
                $a = new Attendance();
                $a->setPlayer($player);
                $a->setDate($sessionAt);
                $a->setStatus($status);
                $a->setComment(null);
                $a->setCreatedAt($now);
                $a->setUpdatedAt($now);
                $this->em->persist($a);
            }
        }

        $this->em->flush();

        return $this->getTeamRollCallForCoach($coach, $teamId, $sessionAt->format(\DateTimeInterface::ATOM));
    }

    private function serialize(Attendance $a): array
    {
        return [
            'id' => $a->getId(),
            'playerId' => $a->getPlayer()?->getId(),
            'date' => $a->getDate()?->format(\DateTimeInterface::ATOM),
            'status' => $a->getStatus()?->value,
            'comment' => $a->getComment(),
            'createdAt' => $a->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $a->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
