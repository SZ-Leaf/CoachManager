CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `lastname` varchar(255),
  `firstname` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `avatar` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `club` (
  `id` integer PRIMARY KEY,
  `discipline` enum,
  `name` varchar(255),
  `logo` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `player` (
  `id` integer PRIMARY KEY,
  `emergency_name` varchar(255),
  `emergency_email` varchar(255),
  `emergency_phone_number` integer,
  `email` varchar(255),
  `phone_number` integer,
  `lastname` varchar(255),
  `firstname` varchar(255),
  `birthday` datetime,
  `avatar` varchar(255),
  `position` enum,
  `status` enum,
  `rating` integer,
  `team_id` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `team` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `category` varchar(255),
  `season` date,
  `inventory_id` integer,
  `club_id` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `attendance` (
  `id` integer PRIMARY KEY,
  `date` datetime,
  `player_id` integer,
  `status` enum,
  `comment` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `inventory` (
  `id` integer PRIMARY KEY,
  `list_id` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `list` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `product_id` integer
);

CREATE TABLE `product` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `quantity` integer
);

CREATE TABLE `communication` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `player_id` integer,
  `recipient_type` enum(player,emergency),
  `recipient_email` varchar(255),
  `subject` varchar(255),
  `body` varchar(255),
  `status` enum(sent,failed),
  `sent_at` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

ALTER TABLE `player` ADD FOREIGN KEY (`team_id`) REFERENCES `team` (`id`);

ALTER TABLE `inventory` ADD FOREIGN KEY (`list_id`) REFERENCES `list` (`id`);

ALTER TABLE `list` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `team` ADD FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`);

ALTER TABLE `communication` ADD FOREIGN KEY (`player_id`) REFERENCES `player` (`id`);

ALTER TABLE `team` ADD FOREIGN KEY (`club_id`) REFERENCES `club` (`id`);

ALTER TABLE `communication` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `attendance` ADD FOREIGN KEY (`player_id`) REFERENCES `player` (`id`);
