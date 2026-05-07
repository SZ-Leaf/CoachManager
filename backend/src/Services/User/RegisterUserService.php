<?php

namespace App\Services\User;

use App\DTO\User\RegisterUserRequest;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Exceptions\User\RegisterUserException;
use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserService
{
   public function __construct(
      private readonly EntityManagerInterface $em,
      private readonly UserRepository $userRepository,
      private readonly UserPasswordHasherInterface $hasher,
      private readonly ValidatorInterface $validator,

   ) {}

   /**
    * @throws RegisterUserException 
    */
   public function registerUser(RegisterUserRequest $dto): array
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
      
      $user = new User();
      $user->setFirstname($dto->firstname);
      $user->setLastname($dto->lastname);
      $user->setEmail($dto->email);
      $user->setPassword($this->hasher->hashPassword($user, $dto->password));
      $user->setAvatar($dto->avatar);
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