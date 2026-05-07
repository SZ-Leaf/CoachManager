<?php

namespace App\Controller;

use App\DTO\User\RegisterUserRequest;
use App\DTO\User\UpdateUserRequest;
use App\Entity\User;
use App\Exceptions\User\RegisterUserException;
use App\Exceptions\User\UpdateUserException;
use App\Services\User\RegisterUserService;
use App\Services\User\UpdateUserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/auth', name: 'api_auth_')]
final class UserController extends AbstractController
{
    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function registerUser(
        Request $request,
        RegisterUserService $registerUserService,
        SerializerInterface $serializer,
    ): JsonResponse {
        try {
            $dto = $serializer->deserialize(
                data: $request->getContent(),
                type: RegisterUserRequest::class,
                format: 'json'
            );

            $result = $registerUserService->registerUser($dto);

            return $this->json(['item' => $result], Response::HTTP_CREATED);
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

    #[Route('/me', name: 'user_update_me', methods: ['PATCH'])]
    public function updateMe(
        Request $request,
        #[CurrentUser] ?User $user,
        UpdateUserService $updateUserService,
        SerializerInterface $serializer,
    ): JsonResponse {
        if ($user === null) {
            return $this->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $avatar = $request->files->get('avatar');
        $avatarFile = $avatar instanceof UploadedFile ? $avatar : null;

        $format = $request->getContentTypeFormat();
        if ($format === 'json' && $request->getContent() !== '') {
            $dto = $serializer->deserialize(
                $request->getContent(),
                UpdateUserRequest::class,
                'json'
            );
        } else {
            $dto = new UpdateUserRequest();
            $fn = $request->request->get('firstname');
            $ln = $request->request->get('lastname');
            $pw = $request->request->get('password');
            $av = $request->request->get('avatar');
            $dto->firstname = \is_string($fn) && $fn !== '' ? $fn : null;
            $dto->lastname = \is_string($ln) && $ln !== '' ? $ln : null;
            $dto->password = \is_string($pw) && $pw !== '' ? $pw : null;
            $dto->avatar = \is_string($av) && $av !== '' ? $av : null;
        }

        try {
            $result = $updateUserService->updateForUser($user, $dto, $avatarFile);

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
