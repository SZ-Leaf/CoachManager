<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\Dashboard\DashboardStatsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/dashboard', name: 'api_dashboard_')]
final class DashboardController extends AbstractController
{
    #[Route('/summary', name: 'summary', methods: ['GET'])]
    public function summary(#[CurrentUser] ?User $user, DashboardStatsService $dashboardStats): JsonResponse
    {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($dashboardStats->getCoachSummary($user));
    }
}
