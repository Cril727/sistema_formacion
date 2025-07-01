-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2025 at 10:52 PM
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
-- Database: `sistema_formacion`
--

-- --------------------------------------------------------

--
-- Table structure for table `aprendiz`
--

CREATE TABLE `aprendiz` (
  `idaprendiz` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aprendiz`
--

INSERT INTO `aprendiz` (`idaprendiz`, `nombre`, `apellido`, `email`, `telefono`) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@example.com', '3001234567'),
(2, 'Cristian', 'Garcia', 'cris@gmail.com', '31243111'),
(3, 'Julian', 'Chaparro', 'jc@gmail.com', '31243111');

-- --------------------------------------------------------

--
-- Table structure for table `ficha`
--

CREATE TABLE `ficha` (
  `idficha` int(11) NOT NULL,
  `codigo` varchar(15) DEFAULT NULL,
  `fecha_inicio_lectiva` date DEFAULT NULL,
  `fecha_fin_lectiva` date DEFAULT NULL,
  `fecha_fin_practica` date DEFAULT NULL,
  `programa_idprograma` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ficha`
--

INSERT INTO `ficha` (`idficha`, `codigo`, `fecha_inicio_lectiva`, `fecha_fin_lectiva`, `fecha_fin_practica`, `programa_idprograma`) VALUES
(1, 'DS1001', '2025-01-15', '2025-11-15', '2026-01-15', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ficha_has_aprendiz_instructor`
--

CREATE TABLE `ficha_has_aprendiz_instructor` (
  `ficha_idficha` int(11) NOT NULL,
  `aprendiz_idaprendiz` int(11) NOT NULL,
  `instructor_idinstructor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ficha_has_aprendiz_instructor`
--

INSERT INTO `ficha_has_aprendiz_instructor` (`ficha_idficha`, `aprendiz_idaprendiz`, `instructor_idinstructor`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `idinstructor` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`idinstructor`, `nombre`, `apellido`, `email`, `telefono`) VALUES
(1, 'Ana', 'Gómez', 'ana.gomez@example.com', '3007654321');

-- --------------------------------------------------------

--
-- Table structure for table `instructor_has_profesion`
--

CREATE TABLE `instructor_has_profesion` (
  `instructor_idinstructor` int(11) NOT NULL,
  `profesion_idprofesion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor_has_profesion`
--

INSERT INTO `instructor_has_profesion` (`instructor_idinstructor`, `profesion_idprofesion`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `profesion`
--

CREATE TABLE `profesion` (
  `idprofesion` int(11) NOT NULL,
  `nombre_profesion` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesion`
--

INSERT INTO `profesion` (`idprofesion`, `nombre_profesion`) VALUES
(1, 'Ingeniero de Sistemas');

-- --------------------------------------------------------

--
-- Table structure for table `programa`
--

CREATE TABLE `programa` (
  `idprograma` int(11) NOT NULL,
  `nombre_programa` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programa`
--

INSERT INTO `programa` (`idprograma`, `nombre_programa`) VALUES
(1, 'Desarrollo de Software');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aprendiz`
--
ALTER TABLE `aprendiz`
  ADD PRIMARY KEY (`idaprendiz`);

--
-- Indexes for table `ficha`
--
ALTER TABLE `ficha`
  ADD PRIMARY KEY (`idficha`),
  ADD KEY `programa_idprograma` (`programa_idprograma`);

--
-- Indexes for table `ficha_has_aprendiz_instructor`
--
ALTER TABLE `ficha_has_aprendiz_instructor`
  ADD PRIMARY KEY (`ficha_idficha`,`aprendiz_idaprendiz`,`instructor_idinstructor`),
  ADD KEY `aprendiz_idaprendiz` (`aprendiz_idaprendiz`),
  ADD KEY `instructor_idinstructor` (`instructor_idinstructor`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`idinstructor`);

--
-- Indexes for table `instructor_has_profesion`
--
ALTER TABLE `instructor_has_profesion`
  ADD PRIMARY KEY (`instructor_idinstructor`,`profesion_idprofesion`),
  ADD KEY `profesion_idprofesion` (`profesion_idprofesion`);

--
-- Indexes for table `profesion`
--
ALTER TABLE `profesion`
  ADD PRIMARY KEY (`idprofesion`);

--
-- Indexes for table `programa`
--
ALTER TABLE `programa`
  ADD PRIMARY KEY (`idprograma`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aprendiz`
--
ALTER TABLE `aprendiz`
  MODIFY `idaprendiz` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ficha`
--
ALTER TABLE `ficha`
  MODIFY `idficha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `idinstructor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `profesion`
--
ALTER TABLE `profesion`
  MODIFY `idprofesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `programa`
--
ALTER TABLE `programa`
  MODIFY `idprograma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ficha`
--
ALTER TABLE `ficha`
  ADD CONSTRAINT `ficha_ibfk_1` FOREIGN KEY (`programa_idprograma`) REFERENCES `programa` (`idprograma`);

--
-- Constraints for table `ficha_has_aprendiz_instructor`
--
ALTER TABLE `ficha_has_aprendiz_instructor`
  ADD CONSTRAINT `ficha_has_aprendiz_instructor_ibfk_1` FOREIGN KEY (`ficha_idficha`) REFERENCES `ficha` (`idficha`),
  ADD CONSTRAINT `ficha_has_aprendiz_instructor_ibfk_2` FOREIGN KEY (`aprendiz_idaprendiz`) REFERENCES `aprendiz` (`idaprendiz`),
  ADD CONSTRAINT `ficha_has_aprendiz_instructor_ibfk_3` FOREIGN KEY (`instructor_idinstructor`) REFERENCES `instructor` (`idinstructor`);

--
-- Constraints for table `instructor_has_profesion`
--
ALTER TABLE `instructor_has_profesion`
  ADD CONSTRAINT `instructor_has_profesion_ibfk_1` FOREIGN KEY (`instructor_idinstructor`) REFERENCES `instructor` (`idinstructor`),
  ADD CONSTRAINT `instructor_has_profesion_ibfk_2` FOREIGN KEY (`profesion_idprofesion`) REFERENCES `profesion` (`idprofesion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
