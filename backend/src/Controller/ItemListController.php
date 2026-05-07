<?php

namespace App\Controller;

use App\DTO\ItemList\CreateItemListRequest;
use App\Entity\User;
use App\Exceptions\ItemList\CreateItemListException;
use App\Services\ItemList\ItemListService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/lists', name: 'api_lists_')]
final class ItemListController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, ItemListService $itemListService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['items' => $itemListService->listForCoach($user)]);
    }

    #[Route('/{id}', name: 'get', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getOne(int $id, #[CurrentUser] ?User $user, ItemListService $itemListService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $itemListService->getForCoach($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, #[CurrentUser] ?User $user, ItemListService $itemListService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $payload = $request->toArray();
            $dto = new CreateItemListRequest();
            $dto->name = $payload['name'] ?? '';
            $rawInventoryId = $payload['inventoryId'] ?? null;
            $dto->inventoryId = \is_int($rawInventoryId)
                ? $rawInventoryId
                : (\is_numeric($rawInventoryId) ? (int) $rawInventoryId : null);

            $result = $itemListService->create($user, $dto);

            return $this->json(['item' => $result], Response::HTTP_CREATED);
        } catch (CreateItemListException $e) {
            $status = match ($e->getCode()) {
                CreateItemListException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                CreateItemListException::INVENTORY_NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json(['message' => $e->getMessage()], $status);
        }
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: ['PATCH', 'PUT'])]
    public function update(int $id, Request $request, #[CurrentUser] ?User $user, ItemListService $itemListService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $name = $request->toArray()['name'] ?? '';

            return $this->json(['item' => $itemListService->update($user, $id, (string) $name)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] ?User $user, ItemListService $itemListService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $itemListService->delete($user, $id);

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
