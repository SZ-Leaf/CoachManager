<?php

namespace App\Services\Player;

use App\Entity\Player;
use App\Entity\User;
use App\Repository\PlayerRepository;

class ListPlayersService
{
    public function __construct(
        private readonly PlayerRepository $playerRepository,
    ) {
    }

    public function list(User $coach): array
    {
        $players = $this->playerRepository->findAllByCoach($coach);

        return array_map(
            fn (Player $player): array => [
                'id' => $player->getId(),
                'firstname' => $player->getFirstname(),
                'lastname' => $player->getLastname(),
                'email' => $player->getEmail(),
                'phoneNumber' => $player->getPhoneNumber(),
                'teamId' => $player->getTeam()?->getId(),
                'position' => $player->getPosition()?->value,
                'status' => $player->getStatus()?->value,
                'rating' => $player->getRating(),
                'createdAt' => $player->getCreatedAt()?->format(\DateTimeInterface::ATOM),
                'updatedAt' => $player->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
            ],
            $players
        );
    }
}
