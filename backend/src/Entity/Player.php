<?php

namespace App\Entity;

use App\Enum\PlayerPosition;
use App\Enum\PlayerStatus;
use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlayerRepository::class)]
class Player
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $emergencyName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $emergencyEmail = null;

    #[ORM\Column(nullable: true)]
    private ?int $emergencyPhoneNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(nullable: true)]
    private ?int $phoneNumber = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $birthday = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(enumType: PlayerPosition::class, nullable: true)]
    private ?PlayerPosition $position = null;

    #[ORM\Column(enumType: PlayerStatus::class, nullable: true)]
    private ?PlayerStatus $status = null;

    #[ORM\Column(nullable: true)]
    private ?int $rating = null;

    #[ORM\ManyToOne(targetEntity: Team::class, inversedBy: 'players')]
    #[ORM\JoinColumn(name: 'team_id', referencedColumnName: 'id')]
    private ?Team $team = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(targetEntity: Attendance::class, mappedBy: 'player')]
    private Collection $attendances;

    #[ORM\OneToMany(targetEntity: Communication::class, mappedBy: 'player')]
    private Collection $communications;

    public function __construct()
    {
        $this->attendances = new ArrayCollection();
        $this->communications = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmergencyName(): ?string
    {
        return $this->emergencyName;
    }

    public function setEmergencyName(?string $emergencyName): static
    {
        $this->emergencyName = $emergencyName;

        return $this;
    }

    public function getEmergencyEmail(): ?string
    {
        return $this->emergencyEmail;
    }

    public function setEmergencyEmail(?string $emergencyEmail): static
    {
        $this->emergencyEmail = $emergencyEmail;

        return $this;
    }

    public function getEmergencyPhoneNumber(): ?int
    {
        return $this->emergencyPhoneNumber;
    }

    public function setEmergencyPhoneNumber(?int $emergencyPhoneNumber): static
    {
        $this->emergencyPhoneNumber = $emergencyPhoneNumber;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhoneNumber(): ?int
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?int $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getBirthday(): ?\DateTimeImmutable
    {
        return $this->birthday;
    }

    public function setBirthday(?\DateTimeImmutable $birthday): static
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getPosition(): ?PlayerPosition
    {
        return $this->position;
    }

    public function setPosition(?PlayerPosition $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getStatus(): ?PlayerStatus
    {
        return $this->status;
    }

    public function setStatus(?PlayerStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): static
    {
        $this->team = $team;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, Attendance>
     */
    public function getAttendances(): Collection
    {
        return $this->attendances;
    }

    public function addAttendance(Attendance $attendance): static
    {
        if (!$this->attendances->contains($attendance)) {
            $this->attendances->add($attendance);
            $attendance->setPlayer($this);
        }

        return $this;
    }

    public function removeAttendance(Attendance $attendance): static
    {
        if ($this->attendances->removeElement($attendance)) {
            if ($attendance->getPlayer() === $this) {
                $attendance->setPlayer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Communication>
     */
    public function getCommunications(): Collection
    {
        return $this->communications;
    }

    public function addCommunication(Communication $communication): static
    {
        if (!$this->communications->contains($communication)) {
            $this->communications->add($communication);
            $communication->setPlayer($this);
        }

        return $this;
    }

    public function removeCommunication(Communication $communication): static
    {
        if ($this->communications->removeElement($communication)) {
            if ($communication->getPlayer() === $this) {
                $communication->setPlayer(null);
            }
        }

        return $this;
    }
}
