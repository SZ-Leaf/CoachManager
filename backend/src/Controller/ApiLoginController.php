<?php


namespace App\Controller;

use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/auth', name: 'api_auth_')]
final class ApiLoginController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'message' => 'Login successful',
            'user' => $user,
        ]);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout()
    {
        throw new \LogicException('This method is intercepted by the logout key on your firewall.');
    }
}
