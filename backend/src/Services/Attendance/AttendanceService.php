<?php

namespace App\Services\Attendance;

use App\Entity\Attendance;
use App\Entity\User;
use App\Enum\AttendanceStatus;
use App\Repository\AttendanceRepository;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;

class AttendanceService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly AttendanceRepository $attendanceRepository,
        private readonly PlayerRepository $playerRepository,
    ) {
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (Attendance $a) => $this->serialize($a),
            $this->attendanceRepository->findAllForCoach($coach)
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getForCoach(User $coach, int $id): array
    {
        $a = $this->attendanceRepository->findOneByIdForCoach($id, $coach);
        if ($a === null) {
            throw new \InvalidArgumentException('Attendance not found', 404);
        }

        return $this->serialize($a);
    }

    /**
     * @param array{playerId: int, date?: ?string, status?: ?string, comment?: ?string} $data
     *
     * @return array<string, mixed>
     */
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

    /**
     * @param array{date?: ?string, status?: ?string, comment?: ?string, playerId?: ?int} $data
     *
     * @return array<string, mixed>
     */
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

    /**
     * @return array<string, mixed>
     */
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
