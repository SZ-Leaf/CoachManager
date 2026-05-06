<?php

namespace App\Controller;

use App\DTO\Inventory\CreateInventoryRequest;
use App\Exceptions\Inventory\CreateInventoryException;
use App\Services\Inventory\CreateInventoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/inventories', name: 'api_inventories_')]
final class InventoryController extends AbstractController
{
    #[Route('', name: 'inventory_create', methods: ['POST'])]
    public function create(Request $request, CreateInventoryService $createInventoryService): JsonResponse
    {
        try {
            $payload = $request->toArray();

            $dto = new CreateInventoryRequest();
            $listIdRaw = $payload['listId'] ?? null;
            $dto->listId = is_int($listIdRaw)
                ? $listIdRaw
                : (is_numeric($listIdRaw) ? (int) $listIdRaw : null);

            $result = $createInventoryService->create($dto);

            return $this->json($result, Response::HTTP_CREATED);
        } catch (CreateInventoryException $e) {
            $status = match ($e->getCode()) {
                CreateInventoryException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                CreateInventoryException::LIST_NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
