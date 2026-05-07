<?php

namespace App\Services\User;

use App\DTO\User\UpdateUserRequest;
use App\Entity\User;
use App\Exceptions\User\UpdateUserException;
use App\Service\AvatarUploadHandler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UpdateUserService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $hasher,
        private readonly ValidatorInterface $validator,
        private readonly AvatarUploadHandler $avatarUploadHandler,
    ) {
    }

    /**
     * @throws UpdateUserException
     */
    public function updateForUser(User $user, UpdateUserRequest $dto, ?UploadedFile $avatarFile = null): array
    {
        $violations = $this->validator->validate($dto);
        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = [
                    'field' => $v->getPropertyPath(),
                    'message' => $v->getMessage(),
                ];
            }
            throw UpdateUserException::validationFailed($errors);
        }

        if ($dto->firstname !== null) {
            $user->setFirstname($dto->firstname);
        }

        if ($dto->lastname !== null) {
            $user->setLastname($dto->lastname);
        }

        if ($avatarFile !== null) {
            $user->setAvatar($this->avatarUploadHandler->store($avatarFile));
        } elseif ($dto->avatar !== null) {
            $user->setAvatar($dto->avatar);
        }

        if ($dto->password !== null) {
            $user->setPassword(
                $this->hasher->hashPassword($user, $dto->password)
            );
        }

        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->em->flush();

        return [
            'item' => JsonAuthenticationSuccessHandler::serializeUser($user),
        ];
    }
}
