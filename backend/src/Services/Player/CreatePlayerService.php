<?php

namespace App\Services\Player;

use App\DTO\Player\CreatePlayerRequest;
use App\Entity\Player;
use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;

class CreatePlayerService
{
    public function __construct(
        private EntityManagerInterface $em,
        private TeamRepository $teamRepository
    ) {}

    public function create(CreatePlayerRequest $dto): array
    {
        if (empty($dto->firstname) || empty($dto->lastname)) {
            throw new \InvalidArgumentException('Firstname and lastname are required');
        }

        $player = new Player();
        $player->setFirstname($dto->firstname);
        $player->setLastname($dto->lastname);
        $player->setEmail($dto->email);
        $player->setPhoneNumber($dto->phoneNumber);
        $player->setEmergencyName($dto->emergencyName);
        $player->setEmergencyEmail($dto->emergencyEmail);
        $player->setEmergencyPhoneNumber($dto->emergencyPhoneNumber);
        $player->setAvatar($dto->avatar);
        $player->setRating($dto->rating);

        if ($dto->birthday !== null) {
            $player->setBirthday(new \DateTimeImmutable($dto->birthday));
        }

        if ($dto->position !== null) {
            $player->setPosition(PlayerPosition::from($dto->position));
        }

        if ($dto->status !== null) {
            $player->setStatus(PlayerStatus::from($dto->status));
        }

        if ($dto->teamId !== null) {
            $team = $this->teamRepository->find($dto->teamId);

            if (!$team) {
                throw new \InvalidArgumentException('Team not found');
            }

            $player->setTeam($team);
        }

        $this->em->persist($player);
        $this->em->flush();

        return [
            'message' => 'Player created',
            'id' => $player->getId(),
        ];
    }
}