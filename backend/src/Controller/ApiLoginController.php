<?php

namespace App\Controller;

use App\Entity\User;
use App\Security\JsonAuthenticationSuccessHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth', name: 'api_auth_')]
final class ApiLoginController extends AbstractController
{
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout()
    {
        throw new \LogicException('This method is intercepted by the logout key on your firewall.');
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'Unauthenticated',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user' => JsonAuthenticationSuccessHandler::serializeUser($user),
        ], Response::HTTP_OK);
    }
}
