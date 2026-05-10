<?php

namespace App\Services\Player;

use App\Entity\User;
use App\Exceptions\Player\GetPlayerException;
use App\Repository\PlayerRepository;

class GetPlayerService
{
    public function __construct(
        private readonly PlayerRepository $playerRepository,
    ) {
    }

    public function get(User $coach, int $id): array
    {
        $player = $this->playerRepository->findOneByIdAndCoach($id, $coach);
        if ($player === null) {
            throw GetPlayerException::notFound();
        }

        return [
            'id' => $player->getId(),
            'firstname' => $player->getFirstname(),
            'lastname' => $player->getLastname(),
            'email' => $player->getEmail(),
            'phoneNumber' => $player->getPhoneNumber(),
            'emergencyName' => $player->getEmergencyName(),
            'emergencyEmail' => $player->getEmergencyEmail(),
            'emergencyPhoneNumber' => $player->getEmergencyPhoneNumber(),
            'birthday' => $player->getBirthday()?->format(\DateTimeInterface::ATOM),
            'avatar' => $player->getAvatar(),
            'position' => $player->getPosition()?->value,
            'status' => $player->getStatus()?->value,
            'rating' => $player->getRating(),
            'teamId' => $player->getTeam()?->getId(),
            'createdAt' => $player->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $player->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
