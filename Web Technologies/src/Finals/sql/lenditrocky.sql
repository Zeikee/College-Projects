-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2024 at 12:08 PM
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
  `equipmentTotalQuantity` int(11) NOT NULL,
  `equipmentBorrowed` int(25) NOT NULL DEFAULT 0,
  `ImagePath` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipmentID`, `equipmentName`, `equipmentTotalQuantity`, `equipmentBorrowed`, `ImagePath`) VALUES
(1, 'Projector', 5, 1, '/assets/images/equipment/projector.png'),
(2, 'Camera Stabelizer', 5, 5, '/assets/images/equipment/equipments-default.png'),
(3, 'DSLR Camera', 3, 0, '/assets/images/equipment/dslr camera.png'),
(4, 'Microphone', 7, 0, '/assets/images/equipment/microphone.png'),
(5, 'Speaker', 4, 0, '/assets/images/equipment/speaker.png'),
(6, 'HDMI Cable', 2, 0, '/assets/images/equipment/hdmi cable.png'),
(7, 'Crimper', 5, 5, '/assets/images/equipment/crimper.png'),
(8, 'Gimbal', 5, 0, '/assets/images/equipment/gimbal.png');

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

--
-- Dumping data for table `equipmenttransaction`
--

INSERT INTO `equipmenttransaction` (`ID`, `equipmentID`, `quantity`, `userId`, `purpose`, `status`, `startdateenddate`, `starttimeendtime`) VALUES
(5, 6, 1, 1, '1233', 'Cancelled', '{\"startdate\":\"2024-11-18\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(7, 1, 1, 1, '123', 'Cancelled', '{\"startdate\":\"2024-11-24\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(8, 3, 1, 1, '123', 'Accepted', '{\"startdate\":\"2024-11-24\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(9, 8, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-24\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(10, 2, 2, 1, '123', 'Pending', '{\"startdate\":\"2024-11-24\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(11, 8, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-24\",\"enddate\":\"2024-11-24\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(12, 4, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-25\",\"enddate\":\"2024-11-25\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(13, 7, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-25\",\"enddate\":\"2024-11-25\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(14, 2, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-25\",\"enddate\":\"2024-11-25\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(15, 2, 1, 1, '123', 'Pending', '{\"startdate\":\"2024-11-25\",\"enddate\":\"2024-11-25\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(17, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(19, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(20, 6, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(21, 8, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(22, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(23, 6, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(24, 8, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(25, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(26, 6, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(27, 8, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(28, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(29, 6, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(30, 8, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(31, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(32, 6, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(33, 8, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}'),
(34, 3, 1, 3, '2131', 'Pending', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-20\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}');

-- --------------------------------------------------------

--
-- Table structure for table `facility`
--

CREATE TABLE `facility` (
  `facilityID` int(11) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `roomNumber` varchar(4) NOT NULL,
  `TotalSeats` int(25) NOT NULL DEFAULT 0,
  `availableDate` date NOT NULL,
  `availableTime` time NOT NULL,
  `otherInfo` text NOT NULL,
  `imagePath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `facility`
--

INSERT INTO `facility` (`facilityID`, `facilityName`, `roomNumber`, `TotalSeats`, `availableDate`, `availableTime`, `otherInfo`, `imagePath`) VALUES
(1, 'Computer Lab', 'D223', 30, '0000-00-00', '00:00:00', 'Seating Capacity of 50.', '/assets/images/facility/room223.png'),
(2, 'Computer Lab', 'D422', 32, '0000-00-00', '00:00:00', 'Laboratory with fast internet connection.', '/assets/images/facility/room422.png'),
(3, 'Computer Lab', 'D423', 36, '0000-00-00', '00:00:00', 'Laboratory with fast internet connection.', '/assets/images/facility/room423.png'),
(4, 'Computer Lab', 'D424', 20, '0000-00-00', '00:00:00', 'Seating Capacity of 40.', '/assets/images/facility/room424.png'),
(5, 'Mac Lab', 'D425', 21, '0000-00-00', '00:00:00', 'Seating capacity of 50.', '/assets/images/facility/room425.png'),
(6, 'Photography Room', 'D427', 28, '2024-10-18', '14:00:00', 'Room for photography.', '/assets/images/facility/room427.png'),
(7, 'Computer Lab', 'D522', 23, '0000-00-00', '00:00:00', 'Has two whiteboards on each side of the lab.', '/assets/images/facility/room522.png'),
(8, 'Computer Lab', 'D523', 28, '0000-00-00', '00:00:00', 'Laboratory with new monitors.', '/assets/images/facility/room523.png'),
(9, 'Computer Lab', 'D524', 15, '0000-00-00', '00:00:00', 'Laboratory with new monitors.', '/assets/images/facility/room524.png'),
(10, 'Mac Lab', 'D526', 13, '0000-00-00', '00:00:00', 'Laboratory with 4 CCTV cameras.', '/assets/images/facility/room526.png'),
(11, 'Computer Lab ', 'D528', 10, '0000-00-00', '00:00:00', 'Seating capacity of 50.', '/assets/images/facility/room528.png'),
(12, 'Computer Lab', 'D722', 19, '0000-00-00', '00:00:00', 'Seating capacity of 45.', '/assets/images/facility/room722.png'),
(13, 'Computer Lab', 'D723', 36, '0000-00-00', '00:00:00', 'Air conditioning needs maintenance.', '/assets/images/facility/room723.png'),
(14, 'Computer Lab', 'D724', 41, '0000-00-00', '00:00:00', 'Seating capacity of 50.', '/assets/images/facility/room724.png'),
(15, 'Computer Lab', 'D725', 37, '0000-00-00', '00:00:00', 'Seating capacity of only 30 people.', '/assets/images/facility/room725.png');

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
  `starttimeendtime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`starttimeendtime`)),
  `Seats` int(25) NOT NULL DEFAULT 30
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `facilitytransaction`
--

INSERT INTO `facilitytransaction` (`ID`, `userId`, `facilityID`, `status`, `purpose`, `specialinstruction`, `startdateenddate`, `starttimeendtime`, `Seats`) VALUES
(2, 1, 9, 'Rejected', '123231321', 'JoshLei', '{\"startdate\":\"2024-11-16\",\"enddate\":\"2024-11-17\"}', '{\"starttime\":\"07:00\",\"endtime\":\"08:00\"}', 12),
(3, 1, 11, 'Done', '12312313', '', '{\"startdate\":\"2024-12-02\",\"enddate\":\"2024-12-03\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 21),
(4, 1, 8, 'Accepted', '231313', '13213', '{\"startdate\":\"2024-12-02\",\"enddate\":\"2024-12-03\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 30),
(7, 5, 2, 'Rejected', 'test22132131', '213213', '{\"startdate\":\"2024-11-30\",\"enddate\":\"2024-12-03\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 0),
(8, 5, 1, 'Pending', '123213', '123131312', '{\"startdate\":\"2024-12-02\",\"enddate\":\"2024-12-03\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 30),
(9, 3, 5, 'Pending', '123123', '13213213', '{\"startdate\":\"2024-11-16\",\"enddate\":\"2024-11-17\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 30),
(10, 3, 6, 'inprogress', 'test', '', '{\"startdate\":\"2024-11-16\",\"enddate\":\"2024-11-17\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 30),
(11, 3, 1, 'Pending', '123', '123', '{\"startdate\":\"2024-12-20\",\"enddate\":\"2024-12-21\"}', '{\"starttime\":\"07:30\",\"endtime\":\"08:30\"}', 0);

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
  `userType` varchar(50) NOT NULL,
  `suspended` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `emailAddress`, `password`, `firstName`, `lastName`, `userType`, `suspended`) VALUES
(1, '2233024@slu.edu.ph', '$2y$10$oMKsZ/LbEWlruY36Bkj9nuOIUjNpS7pOwCtWS7Lv7Mi3td0w1Onz2', 'Ralph Dion', 'Desear', 'admin', 0),
(3, 'joshydevelopment@gmail.com', '$2y$10$mtcrFri0cf.bSQUkkZQyj.b3.RegBEoa88vIYYWSLMFDGggVjiJfK', 'Josh', 'Baldespinosa', 'admin', 0),
(5, '123velopment@gmail.com@slu.edu.ph', '$2y$10$Y1DRtpMmKWmebXGiaJlS9O/PrsjmTpXxWtBLi7xu1kcSspfJ71BC.', '123', '123', 'student', 0),
(6, '1234', '$2y$10$cejjF69kJou4bKbMytmPdesblLE0jbsvXWikCLwLRSSXIkA7HTwdS', '123', '12333', 'student', 0);

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
  MODIFY `equipmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `equipmenttransaction`
--
ALTER TABLE `equipmenttransaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `facilityID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=645;

--
-- AUTO_INCREMENT for table `facilitytransaction`
--
ALTER TABLE `facilitytransaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
