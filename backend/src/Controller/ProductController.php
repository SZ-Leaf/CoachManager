<?php

namespace App\Controller;

use App\DTO\Product\CreateProductRequest;
use App\Exceptions\Product\CreateProductException;
use App\Services\Product\CreateProductService;
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
}
