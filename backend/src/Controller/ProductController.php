<?php

namespace App\Controller;

use App\DTO\Product\CreateProductRequest;
use App\DTO\Product\UpdateProductRequest;
use App\Exceptions\Product\CreateProductException;
use App\Exceptions\Product\UpdateProductException;
use App\Services\Product\CreateProductService;
use App\Services\Product\UpdateProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products', name: 'api_products_')]
final class ProductController extends AbstractController
{
    #[Route('', name: 'product_create', methods: ['POST'])]
    public function create(Request $request, CreateProductService $createProductService): JsonResponse
    {
        try {
            $payload = $request->toArray();

            $dto = new CreateProductRequest();
            $dto->name = $payload['name'] ?? '';
            $qty = $payload['quantity'] ?? null;
            $dto->quantity = is_int($qty)
                ? $qty
                : (is_numeric($qty) ? (int) $qty : null);

            $result = $createProductService->create($dto);

            return $this->json($result, Response::HTTP_CREATED);
        } catch (CreateProductException $e) {
            $status = match ($e->getCode()) {
                CreateProductException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }

    #[Route('/{id}', name: 'product_update', requirements: ['id' => '\\d+'], methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, UpdateProductService $updateProductService): JsonResponse
    {
        try {
            $payload = $request->toArray();

            $dto = new UpdateProductRequest();
            $dto->name = $payload['name'] ?? '';
            $qty = $payload['quantity'] ?? null;
            $dto->quantity = is_int($qty)
                ? $qty
                : (is_numeric($qty) ? (int) $qty : null);

            $result = $updateProductService->update($id, $dto);

            return $this->json($result, Response::HTTP_OK);
        } catch (UpdateProductException $e) {
            $status = match ($e->getCode()) {
                UpdateProductException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                UpdateProductException::NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
