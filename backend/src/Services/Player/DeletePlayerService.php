<?php

namespace App\Services\Player;

use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;

class DeletePlayerService
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function delete(Player $player): array
    {
        $this->em->remove($player);
        $this->em->flush();

        return [
            'message' => 'Player deleted',
        ];
    }
}