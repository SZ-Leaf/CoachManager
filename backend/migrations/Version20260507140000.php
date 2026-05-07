<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Align schema with entities: team↔inventory 1:1, inventory→lists, product→item_list, team.coach, club.coach.
 */
final class Version20260507140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Restructure inventory/lists/products; add team.coach_id and club.coach_id';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE club ADD coach_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE club ADD CONSTRAINT FK_club_coach FOREIGN KEY (coach_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F9EEA759');
        $this->addSql('ALTER TABLE inventory DROP FOREIGN KEY FK_B12D4A363DAE168B');
        $this->addSql('ALTER TABLE `list` DROP FOREIGN KEY FK_44C8F8184584665A');

        $this->addSql('ALTER TABLE product ADD item_list_id INT DEFAULT NULL');
        $this->addSql('UPDATE product p INNER JOIN `list` l ON l.product_id = p.id SET p.item_list_id = l.id WHERE l.product_id IS NOT NULL');

        $this->addSql('ALTER TABLE `list` DROP COLUMN product_id');

        $this->addSql('ALTER TABLE inventory ADD team_id INT DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B12D4A36296CD8AE ON inventory (team_id)');
        $this->addSql('UPDATE inventory i INNER JOIN team t ON t.inventory_id = i.id SET i.team_id = t.id WHERE t.inventory_id IS NOT NULL');

        $this->addSql('ALTER TABLE `list` ADD inventory_id INT DEFAULT NULL');
        $this->addSql('UPDATE `list` l INNER JOIN inventory i ON i.list_id = l.id SET l.inventory_id = i.id WHERE i.list_id IS NOT NULL');

        $this->addSql('ALTER TABLE inventory DROP COLUMN list_id');
        $this->addSql('ALTER TABLE team DROP COLUMN inventory_id');

        $this->addSql('ALTER TABLE team ADD coach_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_team_coach FOREIGN KEY (coach_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql('ALTER TABLE inventory ADD CONSTRAINT FK_inventory_team FOREIGN KEY (team_id) REFERENCES team (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE `list` ADD CONSTRAINT FK_list_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_product_item_list FOREIGN KEY (item_list_id) REFERENCES `list` (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_product_item_list');
        $this->addSql('ALTER TABLE `list` DROP FOREIGN KEY FK_list_inventory');
        $this->addSql('ALTER TABLE inventory DROP FOREIGN KEY FK_inventory_team');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_team_coach');
        $this->addSql('ALTER TABLE club DROP FOREIGN KEY FK_club_coach');

        $this->addSql('ALTER TABLE team DROP COLUMN coach_id');
        $this->addSql('ALTER TABLE team ADD inventory_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inventory ADD list_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE `list` ADD product_id INT DEFAULT NULL');

        $this->addSql('UPDATE inventory i SET i.list_id = (SELECT l.id FROM `list` l WHERE l.inventory_id = i.id LIMIT 1)');

        $this->addSql('ALTER TABLE `list` DROP FOREIGN KEY FK_list_inventory');
        $this->addSql('ALTER TABLE `list` DROP COLUMN inventory_id');

        $this->addSql('DROP INDEX UNIQ_B12D4A36296CD8AE ON inventory');
        $this->addSql('ALTER TABLE inventory DROP COLUMN team_id');

        $this->addSql('UPDATE `list` l INNER JOIN product p ON p.item_list_id = l.id SET l.product_id = p.id WHERE p.item_list_id IS NOT NULL');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_product_item_list');
        $this->addSql('ALTER TABLE product DROP COLUMN item_list_id');

        $this->addSql('UPDATE team t INNER JOIN inventory i ON i.team_id = t.id SET t.inventory_id = i.id');

        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F9EEA759 FOREIGN KEY (inventory_id) REFERENCES inventory (id)');
        $this->addSql('ALTER TABLE inventory ADD CONSTRAINT FK_B12D4A363DAE168B FOREIGN KEY (list_id) REFERENCES `list` (id)');
        $this->addSql('ALTER TABLE `list` ADD CONSTRAINT FK_44C8F8184584665A FOREIGN KEY (product_id) REFERENCES product (id)');

        $this->addSql('ALTER TABLE club DROP COLUMN coach_id');
    }
}
