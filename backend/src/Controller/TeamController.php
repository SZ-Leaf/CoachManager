<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\Team\TeamCrudService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/teams', name: 'api_teams_')]
final class TeamController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(#[CurrentUser] ?User $user, TeamCrudService $teams): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['items' => $teams->listForCoach($user)]);
    }

    #[Route('/{id}', name: 'get', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getOne(int $id, #[CurrentUser] ?User $user, TeamCrudService $teams): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $teams->getForCoach($user, $id)]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, #[CurrentUser] ?User $user, TeamCrudService $teams): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $payload = $request->toArray();

            return $this->json(['item' => $teams->create($user, $payload)], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: ['PATCH', 'PUT'])]
    public function update(int $id, Request $request, #[CurrentUser] ?User $user, TeamCrudService $teams): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            return $this->json(['item' => $teams->update($user, $id, $request->toArray())]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] ?User $user, TeamCrudService $teams): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $teams->delete($user, $id);

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], $e->getCode() ?: Response::HTTP_BAD_REQUEST);
        }
    }
}
