<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\Communication\CommunicationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/messages', name: 'api_messages_')]
final class CommunicationController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, CommunicationService $communicationService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['items' => $communicationService->listForCoach($user)]);
    }

    #[Route('/{id}', name: 'get', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getOne(int $id, #[CurrentUser] ?User $user, CommunicationService $communicationService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $communicationService->getForCoach($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        } catch (\ValueError $e) {
            return $this->json(['message' => 'Invalid enum value'], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, #[CurrentUser] ?User $user, CommunicationService $communicationService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $communicationService->create($user, $request->toArray())], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        } catch (\ValueError $e) {
            return $this->json(['message' => 'Invalid enum value'], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: ['PATCH', 'PUT'])]
    public function update(int $id, Request $request, #[CurrentUser] ?User $user, CommunicationService $communicationService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $communicationService->update($user, $id, $request->toArray())]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        } catch (\ValueError $e) {
            return $this->json(['message' => 'Invalid enum value'], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] ?User $user, CommunicationService $communicationService): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $communicationService->delete($user, $id);

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
