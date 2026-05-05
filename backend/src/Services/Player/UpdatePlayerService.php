<?php

namespace App\Services\Player;

use App\DTO\Player\UpdatePlayerRequest;
use App\Entity\Player;
use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;

class UpdatePlayerService
{
    public function __construct(
        private EntityManagerInterface $em,
        private TeamRepository $teamRepository
    ) {}

    public function update(Player $player, UpdatePlayerRequest $dto): array
    {
        if ($dto->firstname !== null) {
            $player->setFirstname($dto->firstname);
        }

        if ($dto->lastname !== null) {
            $player->setLastname($dto->lastname);
        }

        if ($dto->email !== null) {
            $player->setEmail($dto->email);
        }

        if ($dto->phoneNumber !== null) {
            $player->setPhoneNumber($dto->phoneNumber);
        }

        if ($dto->emergencyName !== null) {
            $player->setEmergencyName($dto->emergencyName);
        }

        if ($dto->emergencyEmail !== null) {
            $player->setEmergencyEmail($dto->emergencyEmail);
        }

        if ($dto->emergencyPhoneNumber !== null) {
            $player->setEmergencyPhoneNumber($dto->emergencyPhoneNumber);
        }

        if ($dto->birthday !== null) {
            $player->setBirthday(new \DateTimeImmutable($dto->birthday));
        }

        if ($dto->avatar !== null) {
            $player->setAvatar($dto->avatar);
        }

        if ($dto->position !== null) {
            $player->setPosition(PlayerPosition::from($dto->position));
        }

        if ($dto->status !== null) {
            $player->setStatus(PlayerStatus::from($dto->status));
        }

        if ($dto->rating !== null) {
            $player->setRating($dto->rating);
        }

        if ($dto->teamId !== null) {
            $team = $this->teamRepository->find($dto->teamId);

            if (!$team) {
                throw new \InvalidArgumentException('Team not found');
            }

            $player->setTeam($team);
        }

        $player->setUpdatedAt(new \DateTimeImmutable());

        $this->em->flush();

        return [
            'message' => 'Player updated',
            'id' => $player->getId(),
        ];
    }
}