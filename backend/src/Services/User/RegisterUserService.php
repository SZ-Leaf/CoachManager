<?php

namespace App\Services\User;

use App\DTO\User\RegisterUserRequest;
use App\Entity\User;
use App\Exceptions\User\RegisterUserException;
use App\Exceptions\User\UpdateUserException;
use App\Repository\UserRepository;
use App\Service\AvatarUploadHandler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterUserService
{
   public function __construct(
      private readonly EntityManagerInterface $em,
      private readonly UserRepository $userRepository,
      private readonly UserPasswordHasherInterface $hasher,
      private readonly ValidatorInterface $validator,
      private readonly AvatarUploadHandler $avatarUploadHandler,
   ) {}

   /**
    * @throws RegisterUserException
    */
   public function registerUser(RegisterUserRequest $dto, ?UploadedFile $avatarFile = null): array
   {
      // DTO Validation
      $violations = $this->validator->validate($dto);

      if (count($violations) > 0) {
         $errors = [];

         foreach ($violations as $v) {
            $errors[] = [
               'field' => $v->getPropertyPath(),
               'message' => $v->getMessage(),
            ];
         }

         throw RegisterUserException::validationFailed($errors);
      }

      if ($this->userRepository->findOneBy(['email' => $dto->email])) {
         throw RegisterUserException::emailExists();
      }

      $avatarPath = null;
      if ($avatarFile !== null) {
         try {
            $avatarPath = $this->avatarUploadHandler->store($avatarFile);
         } catch (UpdateUserException $e) {
            throw RegisterUserException::validationFailed($e->getErrors());
         }
      } elseif ($dto->avatar !== null && $dto->avatar !== '') {
         $avatarPath = $dto->avatar;
      }

      $user = new User();
      $user->setFirstname($dto->firstname);
      $user->setLastname($dto->lastname);
      $user->setEmail($dto->email);
      $user->setPassword($this->hasher->hashPassword($user, $dto->password));
      $user->setAvatar($avatarPath);
      $user->setCreatedAt(new \DateTimeImmutable());
      $user->setUpdatedAt(new \DateTimeImmutable());

      $this->em->persist($user);
      $this->em->flush();

      return [
         'id' => $user->getId(),
         'email' => $user->getEmail(),
         'firstname' => $user->getFirstname(),
         'lastname' => $user->getLastname(),
         'avatar' => $user->getAvatar(),
      ];
   }
}