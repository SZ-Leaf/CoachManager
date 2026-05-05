<?php

namespace App\Controller;

use App\DTO\User\RegisterUserRequest;
use App\Exceptions\User\RegisterUserException;
use App\Services\User\RegisterUserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth', name: 'api_auth_')]
final class UserController extends AbstractController
{
   #[Route('/register', name: 'user_register', methods: ['POST'])]
   public function register(Request $request, RegisterUserService $registerUserService): JsonResponse
   {
      try {
         $payload = $request->toArray();

         $dto = new RegisterUserRequest();
         $dto->firstname = $payload['firstname'] ?? '';
         $dto->lastname = $payload['lastname'] ?? '';
         $dto->email = $payload['email'] ?? '';
         $dto->password = $payload['password'] ?? '';
         $dto->avatar = $payload['avatar'] ?? null;

         $result = $registerUserService->register($dto);

         return $this->json($result, Response::HTTP_CREATED);
      } catch (RegisterUserException $e) {
         $status = match ($e->getCode()) {
            RegisterUserException::EMAIL_EXISTS => Response::HTTP_CONFLICT,
            RegisterUserException::PASSWORD_INVALID,
            RegisterUserException::PASSWORD_COMPROMISED,
            RegisterUserException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
            default => Response::HTTP_BAD_REQUEST,
         };

         return $this->json([
            'message' => $e->getMessage(),
         ], $status);
      }

   }
   
}