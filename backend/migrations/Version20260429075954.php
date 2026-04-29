<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260429075954 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE attendance (id INT AUTO_INCREMENT NOT NULL, date DATETIME DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, comment VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, player_id INT DEFAULT NULL, INDEX IDX_6DE30D9199E6F5DF (player_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE club (id INT AUTO_INCREMENT NOT NULL, discipline VARCHAR(255) DEFAULT NULL, name VARCHAR(255) NOT NULL, logo VARCHAR(255) DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE communication (id INT AUTO_INCREMENT NOT NULL, recipient_type VARCHAR(255) DEFAULT NULL, recipient_email VARCHAR(255) DEFAULT NULL, subject VARCHAR(255) DEFAULT NULL, body VARCHAR(255) DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, sent_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, user_id INT DEFAULT NULL, player_id INT DEFAULT NULL, INDEX IDX_F9AFB5EBA76ED395 (user_id), INDEX IDX_F9AFB5EB99E6F5DF (player_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE inventory (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, list_id INT DEFAULT NULL, INDEX IDX_B12D4A363DAE168B (list_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `list` (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, product_id INT DEFAULT NULL, INDEX IDX_44C8F8184584665A (product_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE player (id INT AUTO_INCREMENT NOT NULL, emergency_name VARCHAR(255) DEFAULT NULL, emergency_email VARCHAR(255) DEFAULT NULL, emergency_phone_number INT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, phone_number INT DEFAULT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, birthday DATETIME DEFAULT NULL, avatar VARCHAR(255) DEFAULT NULL, position VARCHAR(255) DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, rating INT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, team_id INT DEFAULT NULL, INDEX IDX_98197A65296CD8AE (team_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, quantity INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE team (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) DEFAULT NULL, season DATE DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, inventory_id INT DEFAULT NULL, club_id INT DEFAULT NULL, INDEX IDX_C4E0A61F9EEA759 (inventory_id), INDEX IDX_C4E0A61F61190A32 (club_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE attendance ADD CONSTRAINT FK_6DE30D9199E6F5DF FOREIGN KEY (player_id) REFERENCES player (id)');
        $this->addSql('ALTER TABLE communication ADD CONSTRAINT FK_F9AFB5EBA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE communication ADD CONSTRAINT FK_F9AFB5EB99E6F5DF FOREIGN KEY (player_id) REFERENCES player (id)');
        $this->addSql('ALTER TABLE inventory ADD CONSTRAINT FK_B12D4A363DAE168B FOREIGN KEY (list_id) REFERENCES `list` (id)');
        $this->addSql('ALTER TABLE `list` ADD CONSTRAINT FK_44C8F8184584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65296CD8AE FOREIGN KEY (team_id) REFERENCES team (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F9EEA759 FOREIGN KEY (inventory_id) REFERENCES inventory (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F61190A32 FOREIGN KEY (club_id) REFERENCES club (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attendance DROP FOREIGN KEY FK_6DE30D9199E6F5DF');
        $this->addSql('ALTER TABLE communication DROP FOREIGN KEY FK_F9AFB5EBA76ED395');
        $this->addSql('ALTER TABLE communication DROP FOREIGN KEY FK_F9AFB5EB99E6F5DF');
        $this->addSql('ALTER TABLE inventory DROP FOREIGN KEY FK_B12D4A363DAE168B');
        $this->addSql('ALTER TABLE `list` DROP FOREIGN KEY FK_44C8F8184584665A');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65296CD8AE');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F9EEA759');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F61190A32');
        $this->addSql('DROP TABLE attendance');
        $this->addSql('DROP TABLE club');
        $this->addSql('DROP TABLE communication');
        $this->addSql('DROP TABLE inventory');
        $this->addSql('DROP TABLE `list`');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE team');
        $this->addSql('DROP TABLE user');
    }
}
