<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260509180000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Revert team.season VARCHAR(YYYY-YYYY) → DATE when needed (after git reset)';
    }

    public function up(Schema $schema): void
    {
        $row = $this->connection->fetchAssociative(
            <<<'SQL'
            SELECT DATA_TYPE AS t
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'team'
              AND COLUMN_NAME = 'season'
            SQL
        );

        $type = isset($row['t']) ? strtolower((string) $row['t']) : '';

        if ($type !== 'varchar' && $type !== 'char') {
            $this->write('team.season is already non-VARCHAR ('.($row['t'] ?? 'missing').'); no changes.');

            return;
        }

        $this->addSql('ALTER TABLE team ADD season_revert DATE DEFAULT NULL');
        $this->addSql(
            "UPDATE team SET season_revert = STR_TO_DATE(CONCAT(SUBSTRING_INDEX(season, '-', 1), '-07-01'), '%Y-%m-%d') WHERE season IS NOT NULL AND season REGEXP '^[0-9]{4}-[0-9]{4}$'"
        );
        $this->addSql('ALTER TABLE team DROP COLUMN season');
        $this->addSql('ALTER TABLE team CHANGE season_revert season DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $row = $this->connection->fetchAssociative(
            <<<'SQL'
            SELECT DATA_TYPE AS t
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'team'
              AND COLUMN_NAME = 'season'
            SQL
        );

        $type = isset($row['t']) ? strtolower((string) $row['t']) : '';

        if (!\in_array($type, ['date', 'datetime'], true)) {
            $this->write('team.season is not DATE; skip down().');

            return;
        }

        $this->addSql('ALTER TABLE team ADD season_fwd VARCHAR(20) DEFAULT NULL');
        $this->addSql('UPDATE team SET season_fwd = CONCAT(YEAR(season), "-", YEAR(season) + 1) WHERE season IS NOT NULL');
        $this->addSql('ALTER TABLE team DROP COLUMN season');
        $this->addSql('ALTER TABLE team CHANGE season_fwd season VARCHAR(20) DEFAULT NULL');
    }
}
