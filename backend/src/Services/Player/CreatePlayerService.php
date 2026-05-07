<?php

namespace App\Services\Player;

use App\DTO\Player\CreatePlayerRequest;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Exceptions\Player\CreatePlayerException;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CreatePlayerService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TeamRepository $teamRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws CreatePlayerException
     */
    public function create(User $coach, CreatePlayerRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw CreatePlayerException::validationFailed(implode('; ', $errors));
        }

        $team = $this->teamRepository->find($dto->teamId);
        if ($team === null) {
            throw CreatePlayerException::teamNotFound();
        }
        if ($team->getCoach()?->getId() !== $coach->getId()) {
            throw CreatePlayerException::teamForbidden();
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
                $player->setBirthday(new \DateTimeImmutable($dto->birthday));
            } catch (\Throwable) {
                throw CreatePlayerException::invalidBirthday();
            }
        }

        if ($dto->position !== null) {
            try {
                $player->setPosition(PlayerPosition::from($dto->position));
            } catch (\ValueError) {
                throw CreatePlayerException::invalidPosition();
            }
        }

        if ($dto->status !== null) {
            try {
                $player->setStatus(PlayerStatus::from($dto->status));
            } catch (\ValueError) {
                throw CreatePlayerException::invalidStatus();
            }
        }
        $player->setTeam($team);
        $player->setCreatedAt(new \DateTimeImmutable());
        $player->setUpdatedAt(new \DateTimeImmutable());

        $this->em->persist($player);
        $this->em->flush();

        return [
            'id' => $player->getId(),
            'firstname' => $player->getFirstname(),
            'lastname' => $player->getLastname(),
            'teamId' => $player->getTeam()?->getId(),
        ];
    }
}