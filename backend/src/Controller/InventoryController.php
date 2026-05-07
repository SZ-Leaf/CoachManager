<?php

namespace App\Controller;

use App\DTO\Inventory\CreateInventoryRequest;
use App\Entity\User;
use App\Exceptions\Inventory\CreateInventoryException;
use App\Services\Inventory\InventoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/inventories', name: 'api_inventories_')]
final class InventoryController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, InventoryService $inventoryService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['items' => $inventoryService->listForCoach($user)]);
    }

    #[Route('/{id}', name: 'get', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getOne(int $id, #[CurrentUser] ?User $user, InventoryService $inventoryService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $inventoryService->getForCoach($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, #[CurrentUser] ?User $user, InventoryService $inventoryService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $payload = $request->toArray();
            $dto = new CreateInventoryRequest();
            $teamIdRaw = $payload['teamId'] ?? null;
            $dto->teamId = \is_int($teamIdRaw)
                ? $teamIdRaw
                : (\is_numeric($teamIdRaw) ? (int) $teamIdRaw : null);

            $result = $inventoryService->create($user, $dto);

            return $this->json(['item' => $result], Response::HTTP_CREATED);
        } catch (CreateInventoryException $e) {
            $status = match ($e->getCode()) {
                CreateInventoryException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                CreateInventoryException::TEAM_NOT_FOUND => Response::HTTP_NOT_FOUND,
                CreateInventoryException::INVENTORY_EXISTS => Response::HTTP_CONFLICT,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json(['message' => $e->getMessage()], $status);
        }
    }

    #[Route('/{id}', name: 'patch', requirements: ['id' => '\d+'], methods: ['PATCH'])]
    public function patch(int $id, #[CurrentUser] ?User $user, InventoryService $inventoryService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $inventoryService->touch($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] ?User $user, InventoryService $inventoryService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $inventoryService->delete($user, $id);

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
