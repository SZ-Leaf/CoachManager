<?php

namespace App\Controller;

use App\DTO\Player\CreatePlayerRequest;
use App\DTO\Player\UpdatePlayerRequest;
use App\Entity\User;
use App\Exceptions\Player\CreatePlayerException;
use App\Exceptions\Player\DeletePlayerException;
use App\Exceptions\Player\GetPlayerException;
use App\Exceptions\Player\UpdatePlayerException;
use App\Services\Player\CreatePlayerService;
use App\Services\Player\DeletePlayerService;
use App\Services\Player\GetPlayerService;
use App\Services\Player\ListPlayersService;
use App\Services\Player\UpdatePlayerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/players', name: 'api_players_')]
final class PlayerController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, ListPlayersService $listPlayersService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $players = $listPlayersService->list($user);

        return $this->json([
            'items' => $players,
        ], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'get', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function get(
        int $id,
        #[CurrentUser] ?User $user,
        GetPlayerService $getPlayerService
    ): JsonResponse {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $player = $getPlayerService->get($user, $id);

            return $this->json([
                'player' => $player,
            ], Response::HTTP_OK);
        } catch (GetPlayerException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        #[CurrentUser] ?User $user,
        CreatePlayerService $createPlayerService
    ): JsonResponse {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

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
            $dto->rating = isset($payload['rating']) && is_numeric($payload['rating']) ? (int) $payload['rating'] : null;
            $dto->teamId = isset($payload['teamId']) && is_numeric($payload['teamId']) ? (int) $payload['teamId'] : null;

            $player = $createPlayerService->create($user, $dto);

            return $this->json([
                'player' => $player,
            ], Response::HTTP_CREATED);
        } catch (CreatePlayerException $e) {
            $status = match ($e->getCode()) {
                CreatePlayerException::TEAM_NOT_FOUND => Response::HTTP_NOT_FOUND,
                CreatePlayerException::TEAM_FORBIDDEN => Response::HTTP_FORBIDDEN,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'], requirements: ['id' => '\d+'])]
    public function update(
        int $id,
        Request $request,
        #[CurrentUser] ?User $user,
        UpdatePlayerService $updatePlayerService
    ): JsonResponse {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

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
            $dto->rating = isset($payload['rating']) && is_numeric($payload['rating']) ? (int) $payload['rating'] : null;
            $dto->teamId = isset($payload['teamId']) && is_numeric($payload['teamId']) ? (int) $payload['teamId'] : null;

            $player = $updatePlayerService->update($user, $id, $dto);

            return $this->json([
                'player' => $player,
            ], Response::HTTP_OK);
        } catch (UpdatePlayerException $e) {
            $status = match ($e->getCode()) {
                UpdatePlayerException::NOT_FOUND => Response::HTTP_NOT_FOUND,
                UpdatePlayerException::TEAM_NOT_FOUND => Response::HTTP_NOT_FOUND,
                UpdatePlayerException::TEAM_FORBIDDEN => Response::HTTP_FORBIDDEN,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(
        int $id,
        #[CurrentUser] ?User $user,
        DeletePlayerService $deletePlayerService
    ): JsonResponse {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $result = $deletePlayerService->delete($user, $id);

            return $this->json($result, Response::HTTP_OK);
        } catch (DeletePlayerException $e) {
            $status = match ($e->getCode()) {
                DeletePlayerException::NOT_FOUND => Response::HTTP_NOT_FOUND,
                DeletePlayerException::DELETE_BLOCKED => Response::HTTP_CONFLICT,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
