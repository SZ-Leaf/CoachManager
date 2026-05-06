<?php

namespace App\Services\Player;

use App\DTO\Player\CreatePlayerRequest;
use App\Entity\Player;
use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Exceptions\Player\CreatePlayerException;
use App\Repository\TeamRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ValueError;

class CreatePlayerService
{
    public function __construct(
        private EntityManagerInterface $em,
        private TeamRepository $teamRepository
    ) {}

    public function create(CreatePlayerRequest $dto): array
    {
        if (empty($dto->firstname) || empty($dto->lastname)) {
            throw CreatePlayerException::validationFailed('Firstname and lastname are required');
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
            try {
                $player->setBirthday(new DateTimeImmutable($dto->birthday));
            } catch (Exception) {
                throw CreatePlayerException::invalidBirthday();
            }
        }

        if ($dto->position !== null) {
            try {
                $player->setPosition(PlayerPosition::from($dto->position));
            } catch (ValueError) {
                throw CreatePlayerException::invalidPosition();
            }
        }

        if ($dto->status !== null) {
            try {
                $player->setStatus(PlayerStatus::from($dto->status));
            } catch (ValueError) {
                throw CreatePlayerException::invalidStatus();
            }
        }

        if ($dto->teamId !== null) {
            $team = $this->teamRepository->find($dto->teamId);

            if (!$team) {
                throw CreatePlayerException::teamNotFound();
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