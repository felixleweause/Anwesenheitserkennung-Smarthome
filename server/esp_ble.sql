-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 07. Dez 2020 um 20:43
-- Server-Version: 10.3.27-MariaDB-0+deb10u1
-- PHP-Version: 7.3.19-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `esp_ble`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `beacon_data`
--
CREATE DATABASE IF NOT EXISTS esp_ble;
USE esp_ble;

--
-- Daten für Tabelle `beacon_data`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `personen`
--

CREATE TABLE `personen` (
  `name` varchar(255) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `prioritaet` int(11) DEFAULT NULL,
  `state` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*ALTER TABLE `personen` CHANGE `device` `deviceid` VARCHAR(255) NOT NULL;*/
--
-- Daten für Tabelle `personen`

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rooms`
--

CREATE TABLE `rooms` (
  `name` varchar(255) NOT NULL,
  `esp_id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'offline',
  `version` varchar(11) NOT NULL DEFAULT 0,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `config` (
  `titel` varchar(255)  DEFAULT '',
  `value` varchar(1000) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `neural` (
  `titel` varchar(255)  DEFAULT '',
  `value` JSON 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `scanner_micro` (
  `esp_id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'offline',
  `version` varchar(11) NOT NULL DEFAULT 0,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--
-- Daten für Tabelle `rooms`
--
--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `beacon_data`
--
--
-- Indizes für die Tabelle `personen`
--
ALTER TABLE `personen`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `scanner_micro`
  ADD PRIMARY KEY (`id`);
--
-- Indizes für die Tabelle `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `config`
  ADD PRIMARY KEY (`titel`);

ALTER TABLE `neural`
  ADD PRIMARY KEY (`titel`);
--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `beacon_data`
--
--
-- AUTO_INCREMENT für Tabelle `personen`
--
ALTER TABLE `scanner_micro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
ALTER TABLE `personen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT für Tabelle `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;


INSERT IGNORE INTO config
    (titel, value)
VALUES
    ('username', '');
INSERT IGNORE INTO config
    (titel, value)
VALUES
    ('password', '');
INSERT IGNORE INTO config
    (titel, value)
VALUES
    ('firstinstall', '');
INSERT IGNORE INTO config
    (titel, value)
VALUES
    ('cloudtoken', '');
INSERT IGNORE INTO config
    (titel, value)
VALUES
    ('variant', '2');
INSERT IGNORE INTO neural
    (titel, value)
VALUES
    ('net', NULL);
INSERT IGNORE INTO neural
    (titel, value)
VALUES
    ('highlow', NULL);
