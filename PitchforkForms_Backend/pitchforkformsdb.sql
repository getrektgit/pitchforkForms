CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('admin','student') NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_pic` varchar(255)
);

CREATE TABLE `forms` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `creator_id` integer
);

CREATE TABLE `questions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `type` enum('radiobutton','checkbox') NOT NULL,
  `form_id` integer,
  `score` integer NOT NULL
);

CREATE TABLE `answer_options` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `question_id` integer,
  `text` varchar(255) NOT NULL,
  `is_right` bool NOT NULL DEFAULT false
);

CREATE TABLE `submissions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `form_id` integer,
  `submit_time` datetime NOT NULL
);

CREATE TABLE `submission_answers` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `submission_id` integer,
  `answer_id` integer
);

ALTER TABLE `forms` ADD FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`);

ALTER TABLE `questions` ADD FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`);

ALTER TABLE `answer_options` ADD FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

ALTER TABLE `submissions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `submissions` ADD FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`);

ALTER TABLE `submission_answers` ADD FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);

ALTER TABLE `submission_answers` ADD FOREIGN KEY (`answer_id`) REFERENCES `answer_options` (`id`);
