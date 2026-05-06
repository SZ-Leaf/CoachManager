<?php

namespace App\Controller;

use App\DTO\User\RegisterUserRequest;
use App\DTO\User\UpdateUserRequest;
use App\Exceptions\User\RegisterUserException;
use App\Exceptions\User\UpdateUserException;
use App\Services\User\RegisterUserService;
use App\Services\User\UpdateUserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/auth', name: 'api_auth_')]
final class UserController extends AbstractController
{
   #[Route('/register', name: 'user_register', methods: ['POST'])]
   public function registerUser(
      Request $request,
      RegisterUserService $registerUserService,
      SerializerInterface $serializer
   ): JsonResponse {
      try {

         $dto = $serializer->deserialize(
            data: $request->getContent(),
            type: RegisterUserRequest::class,
            format: 'json'
         );

         $result = $registerUserService->registerUser($dto);

         return $this->json($result, Response::HTTP_CREATED);
      } catch (RegisterUserException $e) {

         $status = match ($e->getCode()) {
            RegisterUserException::EMAIL_EXISTS => Response::HTTP_CONFLICT,
            RegisterUserException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
            default => Response::HTTP_BAD_REQUEST,
         };

         return $this->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'errors' => $e->getErrors(),
         ], $status);
      }
   }

   #[Route('/update/{id}', name: 'user_update', methods: ['PATCH'])]
   public function updateUser(
      int $id,
      Request $request,
      UpdateUserService $updateUserService,
      SerializerInterface $serializer
   ): JsonResponse {

      try {
         $dto = $serializer->deserialize(
            data: $request->getContent(),
            type: UpdateUserRequest::class,
            format: 'json'
         );

         $result = $updateUserService->updateUser($id, $dto);

         return $this->json($result, Response::HTTP_OK);
      } catch (UpdateUserException $e) {
         $status = match ($e->getCode()) {
            UpdateUserException::VALIDATION_FAILED => Response::HTTP_BAD_REQUEST,
            UpdateUserException::NOT_FOUND => Response::HTTP_NOT_FOUND,
            default => Response::HTTP_BAD_REQUEST,
         };
         
         return $this->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'errors' => $e->getErrors(),
         ], $status);
      }
   }
}