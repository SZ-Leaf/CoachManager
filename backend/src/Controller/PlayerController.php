<?php

namespace App\Controller;

use App\DTO\Player\CreatePlayerRequest;
use App\DTO\Player\UpdatePlayerRequest;
use App\Entity\Player;
use App\Repository\PlayerRepository;
use App\Services\Player\CreatePlayerService;
use App\Services\Player\DeletePlayerService;
use App\Services\Player\UpdatePlayerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/player')]
final class PlayerController extends AbstractController
{
    #[Route('/', name: 'players', methods:['GET'])]
    public function index(PlayerRepository $playerRepository): JsonResponse
    {
        $players = $playerRepository->findAllPlayers();
        // dd($players);
        return $this->json([
            'players' => $players
        ]);
    }

    #[Route('/{id}', name: 'player', methods:['GET'])]
    public function show(PlayerRepository $playerRepository,int $id): JsonResponse
    {
        $player = $playerRepository->findOnePlayerById($id);
        // dd('je récupère bien un player');

        if (!$player) {
            return $this->json([
                'message' => 'Player not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'player' => $player
        ]);
    }

    #[Route('/new', name: 'player_new', methods:['POST'])]
    public function new(Request $request, CreatePlayerService $createPlayerService): JsonResponse
    {
       try {
            $payload = $request->toArray();

            $dto = new CreatePlayerRequest();
            $dto->firstname = $payload['firstname'] ?? '';
            $dto->lastname = $payload['lastname'] ?? '';
            $dto->email = $payload['email'] ?? null;
            $dto->phoneNumber = $payload['phoneNumber'] ?? null;
            $dto->emergencyName = $payload['emergencyName'] ?? null;
            $dto->emergencyEmail = $payload['emergencyEmail'] ?? null;
            $dto->emergencyPhoneNumber = $payload['emergencyPhoneNumber'] ?? null;
            $dto->birthday = $payload['birthday'] ?? null;
            $dto->avatar = $payload['avatar'] ?? null;
            $dto->position = $payload['position'] ?? null;
            $dto->status = $payload['status'] ?? null;
            $dto->rating = $payload['rating'] ?? null;
            $dto->teamId = $payload['teamId'] ?? null;

            $result = $createPlayerService->create($dto);

            return $this->json($result, Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/edit/{id}', name: 'player_edit', methods:['POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Player $player, EntityManagerInterface $em, UpdatePlayerService $updatePlayerService)
    {
        try {
            $payload = $request->toArray();

            $dto = new UpdatePlayerRequest();
            $dto->firstname = $payload['firstname'] ?? null;
            $dto->lastname = $payload['lastname'] ?? null;
            $dto->email = $payload['email'] ?? null;
            $dto->phoneNumber = $payload['phoneNumber'] ?? null;
            $dto->emergencyName = $payload['emergencyName'] ?? null;
            $dto->emergencyEmail = $payload['emergencyEmail'] ?? null;
            $dto->emergencyPhoneNumber = $payload['emergencyPhoneNumber'] ?? null;
            $dto->birthday = $payload['birthday'] ?? null;
            $dto->avatar = $payload['avatar'] ?? null;
            $dto->position = $payload['position'] ?? null;
            $dto->status = $payload['status'] ?? null;
            $dto->rating = $payload['rating'] ?? null;
            $dto->teamId = $payload['teamId'] ?? null;

            $result = $updatePlayerService->update($player, $dto);

            return $this->json($result);
        } catch (\Throwable $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/delete/{id}', name: 'player_delete', methods:['POST'], requirements: ['id' => '\d+'])]
    public function delete(Player $player, DeletePlayerService $deletePlayerService): JsonResponse
    {
        $result = $deletePlayerService->delete($player);

        return $this->json($result);
    }
}
