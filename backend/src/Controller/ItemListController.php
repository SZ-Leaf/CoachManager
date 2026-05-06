<?php

namespace App\Controller;

use App\DTO\ItemList\CreateItemListRequest;
use App\Exceptions\ItemList\CreateItemListException;
use App\Services\ItemList\CreateItemListService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/lists', name: 'api_lists_')]
final class ItemListController extends AbstractController
{
    #[Route('', name: 'list_create', methods: ['POST'])]
    public function create(Request $request, CreateItemListService $createItemListService): JsonResponse
    {
        try {
            $payload = $request->toArray();

            $dto = new CreateItemListRequest();
            $dto->name = $payload['name'] ?? '';

            if (array_key_exists('productId', $payload)) {
                if ($payload['productId'] === null) {
                    $dto->productId = null;
                } else {
                    $raw = $payload['productId'];
                    $parsed = is_int($raw)
                        ? $raw
                        : (is_numeric($raw) ? (int) $raw : null);
                    if ($parsed === null || $parsed < 1) {
                        throw CreateItemListException::validationFailed('productId doit être un entier strictement positif');
                    }
                    $dto->productId = $parsed;
                }
            }

            $result = $createItemListService->create($dto);

            return $this->json($result, Response::HTTP_CREATED);
        } catch (CreateItemListException $e) {
            $status = match ($e->getCode()) {
                CreateItemListException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                CreateItemListException::PRODUCT_NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
