<?php

namespace App\Services\User;

use App\DTO\User\UpdateUserRequest;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Exceptions\User\UpdateUserException;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserService
{
   public function __construct(
      private readonly EntityManagerInterface $em,
      private readonly UserRepository $userRepository,
      private readonly UserPasswordHasherInterface $hasher,
      private readonly ValidatorInterface $validator,
   ) {}

   /**
    * @throws UpdateUserException
    */
   public function updateUser(int $id, UpdateUserRequest $dto)
   {
      $violations = $this->validator->validate($dto);
      if (count($violations) > 0) {
         $errors = [];
         foreach ($violations as $v) {
            $errors[] = [
               'field' => $v->getPropertyPath(),
               'message' => $v->getMessage(),
            ];
         }
         throw UpdateUserException::validationFailed($errors);
      }

      $user = $this->userRepository->find($id);
      if(!$user) {
         throw UpdateUserException::notFound();
      }

      if ($dto->firstname !== null) {
         $user->setFirstname($dto->firstname);
      }
      
      if ($dto->lastname !== null) {
         $user->setLastname($dto->lastname);
      }
      
      if ($dto->avatar !== null) {
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
         'firstname' => $user->getFirstname(),
         'lastname' => $user->getLastname(),
         'email' => $user->getEmail(),
         'avatar' => $user->getAvatar(),
         'updatedAt' => $user->getUpdatedAt(),
      ];
   }
}