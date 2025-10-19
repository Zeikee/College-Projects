-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2024 at 06:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lenditrocky`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `equipmentID` int(11) NOT NULL,
  `equipmentName` varchar(255) NOT NULL,
  `equipmentQuantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipmentID`, `equipmentName`, `equipmentQuantity`) VALUES
(1, 'Projector', 5),
(2, 'Camera Stabelizer', 5),
(3, 'DSLR Camera', 3),
(4, 'Microphone', 7),
(5, 'Speaker', 4),
(6, 'HDMI Cable', 2),
(7, 'Crimper', 5),
(8, 'Gimbal', 5);

-- --------------------------------------------------------

--
-- Table structure for table `equipmenttransaction`
--

CREATE TABLE `equipmenttransaction` (
  `ID` int(11) NOT NULL,
  `equipmentID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `purpose` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `startdateenddate` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`startdateenddate`)),
  `starttimeendtime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`starttimeendtime`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facility`
--

CREATE TABLE `facility` (
  `facilityID` int(11) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `roomNumber` varchar(4) NOT NULL,
  `availableDate` date NOT NULL,
  `availableTime` time NOT NULL,
  `otherInfo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `facility`
--

INSERT INTO `facility` (`facilityID`, `facilityName`, `roomNumber`, `availableDate`, `availableTime`, `otherInfo`) VALUES
(1, 'Computer Lab', 'D528', '2024-10-15', '09:00:00', 'Seating Capacity of 50.'),
(2, 'Photography Room', 'D427', '2024-10-18', '14:00:00', 'Room for photography.'),
(4, 'Computer Lab', 'D422', '0000-00-00', '00:00:00', 'Laboratory with fast internet connection.'),
(5, 'Computer Lab', 'D424', '0000-00-00', '00:00:00', 'Seating Capacity of 40.'),
(6, 'Mac Lab', 'D425', '0000-00-00', '00:00:00', 'Seating capacity of 50.'),
(7, 'Computer Lab', 'D522', '0000-00-00', '00:00:00', 'Has two whiteboards on each side of the lab.'),
(8, 'Computer Lab', 'D524', '0000-00-00', '00:00:00', 'Laboratory with new monitors.'),
(9, 'Mac Lab', 'D526', '0000-00-00', '00:00:00', 'Laboratory with 4 CCTV cameras.'),
(10, 'Computer Lab ', 'D528', '0000-00-00', '00:00:00', 'Seating capacity of 50.'),
(11, 'Computer Lab', 'D722', '0000-00-00', '00:00:00', 'Seating capacity of 45.'),
(12, 'Computer Lab', 'D723', '0000-00-00', '00:00:00', 'Air conditioning needs maintenance.'),
(13, 'Computer Lab', 'D724', '0000-00-00', '00:00:00', 'Seating capacity of 50.'),
(14, 'Computer Lab', 'D725', '0000-00-00', '00:00:00', 'Seating capacity of only 30 people.');

-- --------------------------------------------------------

--
-- Table structure for table `facilitytransaction`
--

CREATE TABLE `facilitytransaction` (
  `ID` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `facilityID` int(11) NOT NULL,
  `status` varchar(15) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `specialinstruction` varchar(255) NOT NULL,
  `startdateenddate` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`startdateenddate`)),
  `starttimeendtime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`starttimeendtime`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `emailAddress` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `userType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`equipmentID`);

--
-- Indexes for table `equipmenttransaction`
--
ALTER TABLE `equipmenttransaction`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `equipmentID` (`equipmentID`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `facility`
--
ALTER TABLE `facility`
  ADD PRIMARY KEY (`facilityID`);

--
-- Indexes for table `facilitytransaction`
--
ALTER TABLE `facilitytransaction`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `facilityID` (`facilityID`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `equipmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `equipmenttransaction`
--
ALTER TABLE `equipmenttransaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `facilityID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `facilitytransaction`
--
ALTER TABLE `facilitytransaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `equipmenttransaction`
--
ALTER TABLE `equipmenttransaction`
  ADD CONSTRAINT `equipmenttransaction_ibfk_1` FOREIGN KEY (`equipmentID`) REFERENCES `equipment` (`equipmentID`),
  ADD CONSTRAINT `equipmenttransaction_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `facilitytransaction`
--
ALTER TABLE `facilitytransaction`
  ADD CONSTRAINT `facilitytransaction_ibfk_1` FOREIGN KEY (`facilityID`) REFERENCES `facility` (`facilityID`),
  ADD CONSTRAINT `facilitytransaction_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
