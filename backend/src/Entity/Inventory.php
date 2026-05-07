<?php

namespace App\Entity;

use App\Repository\InventoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InventoryRepository::class)]
class Inventory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'inventory', targetEntity: Team::class)]
    #[ORM\JoinColumn(name: 'team_id', referencedColumnName: 'id', nullable: true, unique: true)]
    private ?Team $team = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(targetEntity: ItemList::class, mappedBy: 'inventory')]
    private Collection $itemLists;

    public function __construct()
    {
        $this->itemLists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): static
    {
        $this->team = $team;

        if ($team !== null && $team->getInventory() !== $this) {
            $team->setInventory($this);
        }

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
     * @return Collection<int, ItemList>
     */
    public function getItemLists(): Collection
    {
        return $this->itemLists;
    }

    public function addItemList(ItemList $itemList): static
    {
        if (!$this->itemLists->contains($itemList)) {
            $this->itemLists->add($itemList);
            $itemList->setInventory($this);
        }

        return $this;
    }

    public function removeItemList(ItemList $itemList): static
    {
        if ($this->itemLists->removeElement($itemList)) {
            if ($itemList->getInventory() === $this) {
                $itemList->setInventory(null);
            }
        }

        return $this;
    }
}
