<?php

namespace App\Services\Communication;

use App\Entity\Communication;
use App\Entity\User;
use App\Enum\CommunicationStatus;
use App\Enum\RecipientType;
use App\Repository\CommunicationRepository;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;

class CommunicationService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly CommunicationRepository $communicationRepository,
        private readonly PlayerRepository $playerRepository,
    ) {
    }

    public function listForCoach(User $coach): array
    {
        return array_map(
            fn (Communication $c) => $this->serialize($c),
            $this->communicationRepository->findAllForCoach($coach)
        );
    }

    public function getForCoach(User $coach, int $id): array
    {
        $c = $this->communicationRepository->findOneByIdForCoach($id, $coach);
        if ($c === null) {
            throw new \InvalidArgumentException('Message not found', 404);
        }

        return $this->serialize($c);
    }

    public function create(User $coach, array $data): array
    {
        $playerId = (int) ($data['playerId'] ?? 0);
        if ($playerId < 1) {
            throw new \InvalidArgumentException('playerId is required', 400);
        }
        $player = $this->playerRepository->findOneByIdAndCoach($playerId, $coach);
        if ($player === null) {
            throw new \InvalidArgumentException('Player not found', 404);
        }

        $now = new \DateTimeImmutable();
        $c = new Communication();
        $c->setUser($coach);
        $c->setPlayer($player);
        $c->setRecipientType(!empty($data['recipientType']) ? RecipientType::from((string) $data['recipientType']) : null);
        $c->setRecipientEmail($data['recipientEmail'] ?? null);
        $c->setSubject($data['subject'] ?? null);
        $c->setBody($data['body'] ?? null);
        $c->setStatus(!empty($data['status']) ? CommunicationStatus::from((string) $data['status']) : null);
        $c->setSentAt(!empty($data['sentAt']) ? new \DateTimeImmutable((string) $data['sentAt']) : null);
        $c->setCreatedAt($now);
        $c->setUpdatedAt($now);

        $this->em->persist($c);
        $this->em->flush();

        return $this->serialize($c);
    }

    public function update(User $coach, int $id, array $data): array
    {
        $c = $this->communicationRepository->findOneByIdForCoach($id, $coach);
        if ($c === null) {
            throw new \InvalidArgumentException('Message not found', 404);
        }

        if (\array_key_exists('playerId', $data) && $data['playerId'] !== null) {
            $pid = (int) $data['playerId'];
            $player = $this->playerRepository->findOneByIdAndCoach($pid, $coach);
            if ($player === null) {
                throw new \InvalidArgumentException('Player not found', 404);
            }
            $c->setPlayer($player);
        }
        if (\array_key_exists('recipientType', $data)) {
            $c->setRecipientType(!empty($data['recipientType']) ? RecipientType::from((string) $data['recipientType']) : null);
        }
        if (\array_key_exists('recipientEmail', $data)) {
            $c->setRecipientEmail($data['recipientEmail']);
        }
        if (\array_key_exists('subject', $data)) {
            $c->setSubject($data['subject']);
        }
        if (\array_key_exists('body', $data)) {
            $c->setBody($data['body']);
        }
        if (\array_key_exists('status', $data)) {
            $c->setStatus(!empty($data['status']) ? CommunicationStatus::from((string) $data['status']) : null);
        }
        if (\array_key_exists('sentAt', $data)) {
            $c->setSentAt(!empty($data['sentAt']) ? new \DateTimeImmutable((string) $data['sentAt']) : null);
        }

        $c->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->serialize($c);
    }

    public function delete(User $coach, int $id): void
    {
        $c = $this->communicationRepository->findOneByIdForCoach($id, $coach);
        if ($c === null) {
            throw new \InvalidArgumentException('Message not found', 404);
        }
        $this->em->remove($c);
        $this->em->flush();
    }

    private function serialize(Communication $c): array
    {
        return [
            'id' => $c->getId(),
            'userId' => $c->getUser()?->getId(),
            'playerId' => $c->getPlayer()?->getId(),
            'recipientType' => $c->getRecipientType()?->value,
            'recipientEmail' => $c->getRecipientEmail(),
            'subject' => $c->getSubject(),
            'body' => $c->getBody(),
            'status' => $c->getStatus()?->value,
            'sentAt' => $c->getSentAt()?->format(\DateTimeInterface::ATOM),
            'createdAt' => $c->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'updatedAt' => $c->getUpdatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
