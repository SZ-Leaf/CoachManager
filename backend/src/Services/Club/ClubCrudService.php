<?php

namespace App\Services\Club;

use App\Entity\Club;
use App\Entity\User;
use App\Enum\Discipline;
use App\Repository\ClubRepository;
use Doctrine\ORM\EntityManagerInterface;

class ClubCrudService
{
    public function __construct(
        private readonly ClubRepository $clubRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    public function listForCoach(User $coach): array
    {
        return array_map(fn (Club $c) => $this->serialize($c), $this->clubRepository->findAllForCoach($coach));
    }

    public function getForCoach(User $coach, int $id): array
    {
        $club = $this->clubRepository->findOneByIdForCoach($id, $coach);
        if ($club === null) {
            throw new \InvalidArgumentException('Club not found', 404);
        }

        return $this->serialize($club);
    }

    public function create(User $coach, array $data): array
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \InvalidArgumentException('Name is required', 400);
        }

        $now = new \DateTimeImmutable();
        $club = new Club();
        $club->setName($name);
        $club->setCoach($coach);
        if (!empty($data['discipline'])) {
            $club->setDiscipline(Discipline::from((string) $data['discipline']));
        }
        $club->setLogo($data['logo'] ?? null);
        $club->setDescription($data['description'] ?? null);
        $club->setCreatedAt($now);
        $club->setUpdatedAt($now);

        $this->em->persist($club);
        $this->em->flush();

        return $this->serialize($club);
    }

    public function update(User $coach, int $id, array $data): array
    {
        $club = $this->clubRepository->findOneByIdForCoach($id, $coach);
        if ($club === null) {
            throw new \InvalidArgumentException('Club not found', 404);
        }

        if (\array_key_exists('name', $data) && $data['name'] !== null) {
            $n = trim((string) $data['name']);
            if ($n === '') {
                throw new \InvalidArgumentException('Name cannot be empty', 400);
            }
            $club->setName($n);
        }
        if (\array_key_exists('discipline', $data)) {
            $club->setDiscipline(!empty($data['discipline']) ? Discipline::from((string) $data['discipline']) : null);
        }
        if (\array_key_exists('logo', $data)) {
            $club->setLogo($data['logo']);
        }
        if (\array_key_exists('description', $data)) {
            $club->setDescription($data['description']);
        }

        $club->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->serialize($club);
    }

    public function delete(User $coach, int $id): void
    {
        $club = $this->clubRepository->findOneByIdForCoach($id, $coach);
        if ($club === null) {
            throw new \InvalidArgumentException('Club not found', 404);
        }
        if (!$club->getTeams()->isEmpty()) {
            throw new \InvalidArgumentException('Cannot delete club that still has teams', 409);
        }

        $this->em->remove($club);
        $this->em->flush();
    }

    private function serialize(Club $club): array
    {
        return [
            'id' => $club->getId(),
            'name' => $club->getName(),
            'discipline' => $club->getDiscipline()?->value,
            'logo' => $club->getLogo(),
            'description' => $club->getDescription(),
            'createdAt' => $club->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $club->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
