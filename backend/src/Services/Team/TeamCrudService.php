<?php

namespace App\Services\Team;

use App\Entity\Team;
use App\Entity\User;
use App\Repository\ClubRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;

class TeamCrudService
{
    public function __construct(
        private readonly TeamRepository $teamRepository,
        private readonly ClubRepository $clubRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listForCoach(User $coach): array
    {
        return array_map(fn (Team $t) => $this->serialize($t), $this->teamRepository->findAllByCoach($coach));
    }

    /**
     * @return array<string, mixed>
     */
    public function getForCoach(User $coach, int $id): array
    {
        $team = $this->teamRepository->findOneByIdAndCoach($id, $coach);
        if ($team === null) {
            throw new \InvalidArgumentException('Team not found', 404);
        }

        return $this->serialize($team);
    }

    /**
     * @param array{name: string, category?: ?string, season?: ?string, clubId?: ?int} $data
     *
     * @return array<string, mixed>
     */
    public function create(User $coach, array $data): array
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \InvalidArgumentException('Name is required', 400);
        }

        $now = new \DateTimeImmutable();
        $team = new Team();
        $team->setName($name);
        $team->setCoach($coach);
        $team->setCategory(isset($data['category']) ? (string) $data['category'] : null);
        if (!empty($data['season'])) {
            $team->setSeason(new \DateTimeImmutable($data['season']));
        }
        if (!empty($data['clubId'])) {
            $clubId = (int) $data['clubId'];
            $club = $this->clubRepository->findOneByIdForCoach($clubId, $coach);
            if ($club === null) {
                throw new \InvalidArgumentException('Club not found', 404);
            }
            $team->setClub($club);
        }
        $team->setCreatedAt($now);
        $team->setUpdatedAt($now);

        $this->em->persist($team);
        $this->em->flush();

        return $this->serialize($team);
    }

    /**
     * @param array{name?: ?string, category?: ?string, season?: ?string, clubId?: mixed} $data
     *
     * @return array<string, mixed>
     */
    public function update(User $coach, int $id, array $data): array
    {
        $team = $this->teamRepository->findOneByIdAndCoach($id, $coach);
        if ($team === null) {
            throw new \InvalidArgumentException('Team not found', 404);
        }

        if (\array_key_exists('name', $data) && $data['name'] !== null) {
            $n = trim((string) $data['name']);
            if ($n === '') {
                throw new \InvalidArgumentException('Name cannot be empty', 400);
            }
            $team->setName($n);
        }
        if (\array_key_exists('category', $data)) {
            $team->setCategory($data['category'] !== null ? (string) $data['category'] : null);
        }
        if (\array_key_exists('season', $data)) {
            $team->setSeason(!empty($data['season']) ? new \DateTimeImmutable((string) $data['season']) : null);
        }
        if (\array_key_exists('clubId', $data)) {
            if ($data['clubId'] === null || $data['clubId'] === '') {
                $team->setClub(null);
            } else {
                $clubId = (int) $data['clubId'];
                $club = $this->clubRepository->findOneByIdForCoach($clubId, $coach);
                if ($club === null) {
                    throw new \InvalidArgumentException('Club not found', 404);
                }
                $team->setClub($club);
            }
        }

        $team->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->serialize($team);
    }

    public function delete(User $coach, int $id): void
    {
        $team = $this->teamRepository->findOneByIdAndCoach($id, $coach);
        if ($team === null) {
            throw new \InvalidArgumentException('Team not found', 404);
        }
        if (!$team->getPlayers()->isEmpty()) {
            throw new \InvalidArgumentException('Cannot delete team with players', 409);
        }

        $this->em->remove($team);
        $this->em->flush();
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Team $team): array
    {
        return [
            'id' => $team->getId(),
            'name' => $team->getName(),
            'category' => $team->getCategory(),
            'season' => $team->getSeason()?->format('Y-m-d'),
            'clubId' => $team->getClub()?->getId(),
            'coachId' => $team->getCoach()?->getId(),
            'createdAt' => $team->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $team->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
