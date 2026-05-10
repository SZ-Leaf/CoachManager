<?php

namespace App\Services\Player;

use App\Entity\User;
use App\Exceptions\Player\DeletePlayerException;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;

class DeletePlayerService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly PlayerRepository $playerRepository,
    ) {
    }

    public function delete(User $coach, int $id): array
    {
        $player = $this->playerRepository->findOneByIdAndCoach($id, $coach);
        if ($player === null) {
            throw DeletePlayerException::notFound();
        }

        if (!$player->getAttendances()->isEmpty() || !$player->getCommunications()->isEmpty()) {
            throw DeletePlayerException::deleteBlocked();
        }

        $this->em->remove($player);
        $this->em->flush();

        return [
            'id' => $id,
            'deleted' => true,
        ];
    }
}