<?php

namespace App\Services\Player;

use App\DTO\Player\UpdatePlayerRequest;
use App\Entity\User;
use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Exceptions\Player\UpdatePlayerException;
use App\Repository\CoachTeamAccessFilter;
use App\Repository\PlayerRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UpdatePlayerService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TeamRepository $teamRepository,
        private readonly PlayerRepository $playerRepository,
        private readonly ValidatorInterface $validator,
    ) {
    }

    /**
     * @throws UpdatePlayerException
     */
    public function update(User $coach, int $id, UpdatePlayerRequest $dto): array
    {
        $violations = $this->validator->validate($dto);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = sprintf('%s: %s', $v->getPropertyPath(), $v->getMessage());
            }
            throw UpdatePlayerException::validationFailed(implode('; ', $errors));
        }

        $player = $this->playerRepository->findOneByIdAndCoach($id, $coach);
        if ($player === null) {
            throw UpdatePlayerException::notFound();
        }

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
            try {
                $player->setBirthday(new \DateTimeImmutable($dto->birthday));
            } catch (\Throwable) {
                throw UpdatePlayerException::invalidBirthday();
            }
        }

        if ($dto->avatar !== null) {
            $player->setAvatar($dto->avatar);
        }

        if ($dto->position !== null) {
            try {
                $player->setPosition(PlayerPosition::from($dto->position));
            } catch (\ValueError) {
                throw UpdatePlayerException::invalidPosition();
            }
        }

        if ($dto->status !== null) {
            try {
                $player->setStatus(PlayerStatus::from($dto->status));
            } catch (\ValueError) {
                throw UpdatePlayerException::invalidStatus();
            }
        }

        if ($dto->rating !== null) {
            $player->setRating($dto->rating);
        }

        if ($dto->teamId !== null) {
            $team = $this->teamRepository->find($dto->teamId);

            if ($team === null) {
                throw UpdatePlayerException::teamNotFound();
            }
            if (!CoachTeamAccessFilter::coachHasTeamAccess($team, $coach)) {
                throw UpdatePlayerException::teamForbidden();
            }

            $player->setTeam($team);
        }

        $player->setUpdatedAt(new \DateTimeImmutable());

        $this->em->flush();

        return [
            'id' => $player->getId(),
            'firstname' => $player->getFirstname(),
            'lastname' => $player->getLastname(),
            'teamId' => $player->getTeam()?->getId(),
        ];
    }
}