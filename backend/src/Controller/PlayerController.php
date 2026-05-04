<?php

namespace App\Controller;

use App\Entity\Player;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/player')]
final class PlayerController extends AbstractController
{
    #[Route('/', name: 'players', methods:['GET'])]
    public function index(PlayerRepository $playerRepository): JsonResponse
    {
        $players = $playerRepository->findAllPlayers();
        dd($players);
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PlayerController.php',
            'players' => $players
        ]);
    }

    #[Route('/{id}', name: 'player', methods:['GET'])]
    public function show(PlayerRepository $playerRepository,int $id): JsonResponse
    {
        $player = $playerRepository->findOnePlayerById($id);
        // dd('je récupère bien un player');

        return $this->json([
            'player' => $player
        ]);
    }

    #[Route('/new', name: 'player_new', methods:['POST'])]
    public function new(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['firstname']) || empty($data['lastname'])) {
            return $this->json(['error' => 'Firstname and lastname are required'], 400);
        }

        $player = new Player();
        $player->setFirstname($data['firstname']);
        $player->setLastname($data['lastname']);
        $player->setEmail($data['email'] ?? null);
        $player->setPhoneNumber($data['phoneNumber'] ?? null);
        $player->setEmergencyName($data['emergencyName'] ?? null);
        $player->setEmergencyEmail($data['emergencyEmail'] ?? null);
        $player->setEmergencyPhoneNumber($data['emergencyPhoneNumber'] ?? null);
        $player->setAvatar($data['avatar'] ?? null);
        $player->setRating($data['rating'] ?? null);
        $player->setCreatedAt(new \DateTimeImmutable());
        $player->setUpdatedAt(new \DateTimeImmutable());

        $em->persist($player);
        $em->flush();

        return $this->json([
            'message' => 'Player created',
            'id' => $player->getId(),
        ], 201);
    }

    #[Route('/edit/{id}', name: 'player_edit', methods:['GET','POST'])]
    public function edit(Request $request, Player $player, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        if (array_key_exists('firstname', $data)) {
            $player->setFirstname($data['firstname']);
        }

        if (array_key_exists('lastname', $data)) {
            $player->setLastname($data['lastname']);
        }

        if (array_key_exists('email', $data)) {
            $player->setEmail($data['email']);
        }

        if (array_key_exists('phoneNumber', $data)) {
            $player->setPhoneNumber($data['phoneNumber']);
        }

        if (array_key_exists('emergencyName', $data)) {
            $player->setEmergencyName($data['emergencyName']);
        }

        if (array_key_exists('emergencyEmail', $data)) {
            $player->setEmergencyEmail($data['emergencyEmail']);
        }

        if (array_key_exists('emergencyPhoneNumber', $data)) {
            $player->setEmergencyPhoneNumber($data['emergencyPhoneNumber']);
        }

        if (array_key_exists('avatar', $data)) {
            $player->setAvatar($data['avatar']);
        }

        if (array_key_exists('rating', $data)) {
            $player->setRating($data['rating']);
        }

        $player->setUpdatedAt(new \DateTimeImmutable());

        $em->flush();

        return $this->json([
            'message' => 'Player updated',
            'id' => $player->getId(),
        ]);
    }

    #[Route('/delete/{id}', name: 'player_delete', methods:['POST'])]
    public function delete(Player $player, EntityManagerInterface $em)
    {
        $em->remove($player);
        $em->flush();

        return $this->json([
            'message' => 'Player deleted',
        ]);
    }
}
