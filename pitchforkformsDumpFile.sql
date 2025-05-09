-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Máj 05. 20:24
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `pitchforkforms`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `answer_options`
--

CREATE TABLE `answer_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `is_right` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `answer_options`
--

INSERT INTO `answer_options` (`id`, `question_id`, `text`, `is_right`) VALUES
(1, 1, '3', 0),
(2, 1, '4', 1),
(3, 2, '1', 0),
(4, 2, '2', 1),
(5, 2, '4', 1),
(6, 3, 'Yes', 1),
(7, 3, 'No', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `forms`
--

CREATE TABLE `forms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `creator_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `forms`
--

INSERT INTO `forms` (`id`, `name`, `creator_id`) VALUES
(1, 'Sample Form A', 1),
(2, 'Sample Form B', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `type` enum('radiobutton','checkbox') NOT NULL,
  `form_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `questions`
--

INSERT INTO `questions` (`id`, `text`, `type`, `form_id`, `score`) VALUES
(1, 'What is 2 + 2?', 'radiobutton', 1, 5),
(2, 'Select even numbers', 'checkbox', 1, 10),
(3, 'Is the sky blue?', 'radiobutton', 2, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sent_forms`
--

CREATE TABLE `sent_forms` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `form_id` int(11) DEFAULT NULL,
  `sent_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `sent_forms`
--

INSERT INTO `sent_forms` (`id`, `user_id`, `form_id`, `sent_at`) VALUES
(1, 2, 1, '2024-03-31 12:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `form_id` int(11) DEFAULT NULL,
  `submit_time` datetime NOT NULL,
  `total_score` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `submissions`
--

INSERT INTO `submissions` (`id`, `user_id`, `form_id`, `submit_time`, `total_score`) VALUES
(1, 2, 1, '2024-04-01 10:00:00', 15);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `submission_answers`
--

CREATE TABLE `submission_answers` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `answer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `submission_answers`
--

INSERT INTO `submission_answers` (`id`, `submission_id`, `answer_id`) VALUES
(1, 1, 2),
(2, 1, 4),
(3, 1, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('admin','student') NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `role`, `password_hash`, `profile_pic`) VALUES
(1, 'pitchforkformsnotify@gmail.com', 'Admin', 'admin', '$2b$10$HByptxncW0r0yY6twKEdvewjbd7cK4VBPySIGI.zgxoEZPvETynTW', NULL),
(2, 'test@example.com', 'Student', 'student', '$2b$10$tYhRWQEjtTDPtvor1zT6NeFMRaYlyB95mypd4ZqYv2BudZ8UV0t9K', 'asd123');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `answer_options`
--
ALTER TABLE `answer_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- A tábla indexei `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- A tábla indexei `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_id` (`form_id`);

--
-- A tábla indexei `sent_forms`
--
ALTER TABLE `sent_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `form_id` (`form_id`);

--
-- A tábla indexei `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `form_id` (`form_id`);

--
-- A tábla indexei `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `answer_options`
--
ALTER TABLE `answer_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `forms`
--
ALTER TABLE `forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `sent_forms`
--
ALTER TABLE `sent_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `submission_answers`
--
ALTER TABLE `submission_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answer_options`
--
ALTER TABLE `answer_options`
  ADD CONSTRAINT `answer_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Megkötések a táblához `forms`
--
ALTER TABLE `forms`
  ADD CONSTRAINT `forms_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`);

--
-- Megkötések a táblához `sent_forms`
--
ALTER TABLE `sent_forms`
  ADD CONSTRAINT `sent_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sent_forms_ibfk_2` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`);

--
-- Megkötések a táblához `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`);

--
-- Megkötések a táblához `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD CONSTRAINT `submission_answers_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`),
  ADD CONSTRAINT `submission_answers_ibfk_2` FOREIGN KEY (`answer_id`) REFERENCES `answer_options` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
