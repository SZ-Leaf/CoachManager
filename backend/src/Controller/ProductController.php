<?php

namespace App\Controller;

use App\DTO\Product\CreateProductRequest;
use App\DTO\Product\UpdateProductRequest;
use App\Entity\User;
use App\Exceptions\Product\CreateProductException;
use App\Exceptions\Product\UpdateProductException;
use App\Services\Product\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/products', name: 'api_products_')]
final class ProductController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, ProductService $productService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['items' => $productService->listForCoach($user)]);
    }

    #[Route('/{id}', name: 'get', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getOne(int $id, #[CurrentUser] ?User $user, ProductService $productService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $productService->getForCoach($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, #[CurrentUser] ?User $user, ProductService $productService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $payload = $request->toArray();
            $dto = new CreateProductRequest();
            $dto->name = $payload['name'] ?? '';
            $qty = $payload['quantity'] ?? null;
            $dto->quantity = \is_int($qty)
                ? $qty
                : (\is_numeric($qty) ? (int) $qty : null);
            $itemListId = $payload['itemListId'] ?? null;
            $dto->itemListId = \is_int($itemListId)
                ? $itemListId
                : (\is_numeric($itemListId) ? (int) $itemListId : null);

            $result = $productService->create($user, $dto);

            return $this->json(['item' => $result], Response::HTTP_CREATED);
        } catch (CreateProductException $e) {
            $status = match ($e->getCode()) {
                CreateProductException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                CreateProductException::ITEM_LIST_NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json(['message' => $e->getMessage()], $status);
        }
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\\d+'], methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, #[CurrentUser] ?User $user, ProductService $productService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $payload = $request->toArray();
            $dto = new UpdateProductRequest();
            $dto->name = $payload['name'] ?? '';
            $qty = $payload['quantity'] ?? null;
            $dto->quantity = \is_int($qty)
                ? $qty
                : (\is_numeric($qty) ? (int) $qty : null);
            $itemListId = $payload['itemListId'] ?? null;
            $dto->itemListId = $itemListId === null ? null : (\is_int($itemListId) ? $itemListId : (\is_numeric($itemListId) ? (int) $itemListId : null));

            $result = $productService->update($user, $id, $dto);

            return $this->json(['item' => $result], Response::HTTP_OK);
        } catch (UpdateProductException $e) {
            $status = match ($e->getCode()) {
                UpdateProductException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
                UpdateProductException::NOT_FOUND => Response::HTTP_NOT_FOUND,
                UpdateProductException::ITEM_LIST_NOT_FOUND => Response::HTTP_NOT_FOUND,
                default => Response::HTTP_BAD_REQUEST,
            };

            return $this->json(['message' => $e->getMessage()], $status);
        }
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] ?User $user, ProductService $productService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $productService->delete($user, $id);

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
