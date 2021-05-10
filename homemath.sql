-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: homemath
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment_practice`
--

DROP TABLE IF EXISTS `assignment_practice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_practice` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `is_visible` tinyint(1) NOT NULL,
  `assign_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `classroom_id` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `assignment_practice_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignment_tutorial`
--

DROP TABLE IF EXISTS `assignment_tutorial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_tutorial` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `is_visible` tinyint(1) NOT NULL,
  `assign_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `video_url` varchar(255) NOT NULL,
  `tag` varchar(30) NOT NULL,
  `follow_up_practice_id` mediumint DEFAULT NULL,
  `classroom_id` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `follow_up_practice_id` (`follow_up_practice_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `assignment_tutorial_ibfk_1` FOREIGN KEY (`follow_up_practice_id`) REFERENCES `assignment_practice` (`id`),
  CONSTRAINT `assignment_tutorial_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignment_work`
--

DROP TABLE IF EXISTS `assignment_work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_work` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `is_visible` tinyint(1) NOT NULL,
  `assign_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `time_limit` smallint DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `classroom_id` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `assignment_work_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`),
  CONSTRAINT `assignment_work_chk_1` CHECK (((`due_date` is null) or (cast(`due_date` as date) >= cast(`assign_date` as date))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `award`
--

DROP TABLE IF EXISTS `award`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `award` (
  `name` varchar(30) NOT NULL,
  `image` mediumblob NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `grade` char(1) DEFAULT 'K',
  `instructor_name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `instructor_name` (`instructor_name`),
  CONSTRAINT `classroom_ibfk_1` FOREIGN KEY (`instructor_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `valid_grade` CHECK (((`grade` = _utf8mb4'K') or (`grade` = _utf8mb4'1') or (`grade` = _utf8mb4'2') or (`grade` = _utf8mb4'3') or (`grade` = _utf8mb4'4')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `earns_award`
--

DROP TABLE IF EXISTS `earns_award`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `earns_award` (
  `student_name` varchar(16) NOT NULL,
  `award_name` varchar(30) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assignment_id` mediumint DEFAULT NULL,
  PRIMARY KEY (`student_name`,`award_name`,`date`),
  KEY `award_name` (`award_name`),
  CONSTRAINT `earns_award_ibfk_1` FOREIGN KEY (`student_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `earns_award_ibfk_2` FOREIGN KEY (`award_name`) REFERENCES `award` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `practice_attempt`
--

DROP TABLE IF EXISTS `practice_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practice_attempt` (
  `student_name` varchar(16) NOT NULL,
  `assignment_id` mediumint NOT NULL,
  `completion_date` timestamp NOT NULL,
  `num_questions_attempted` smallint unsigned NOT NULL,
  PRIMARY KEY (`student_name`,`assignment_id`,`completion_date`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `practice_attempt_ibfk_1` FOREIGN KEY (`student_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `practice_attempt_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignment_practice` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `practice_question`
--

DROP TABLE IF EXISTS `practice_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practice_question` (
  `assignment_id` mediumint NOT NULL,
  `question_id` mediumint NOT NULL,
  `allow_hints` tinyint(1) NOT NULL,
  `question_number` smallint NOT NULL,
  PRIMARY KEY (`assignment_id`,`question_id`,`question_number`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `practice_question_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment_practice` (`id`),
  CONSTRAINT `practice_question_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `question_type` tinyint unsigned NOT NULL,
  `question` json NOT NULL,
  `answers` json NOT NULL,
  `author_name` varchar(16) DEFAULT NULL,
  `preset_id` mediumint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_author_name` (`author_name`),
  KEY `preset_id` (`preset_id`),
  CONSTRAINT `FK_author_name` FOREIGN KEY (`author_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`preset_id`) REFERENCES `question_preset` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_preset`
--

DROP TABLE IF EXISTS `question_preset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_preset` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `grade` char(1) DEFAULT NULL,
  `author_name` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `valid_grade_2` CHECK (((`grade` = _cp850'K') or (`grade` = _cp850'1') or (`grade` = _cp850'2') or (`grade` = _cp850'3') or (`grade` = _cp850'4')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tutorial_view`
--

DROP TABLE IF EXISTS `tutorial_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutorial_view` (
  `student_name` varchar(16) NOT NULL,
  `assignment_id` mediumint NOT NULL,
  `completion_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_name`,`assignment_id`,`completion_date`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `tutorial_view_ibfk_1` FOREIGN KEY (`student_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `tutorial_view_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignment_tutorial` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_name` varchar(16) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `is_teacher` tinyint(1) NOT NULL,
  `classroom_id` mediumint DEFAULT NULL,
  `hex_color` char(6) DEFAULT '00ff00',
  PRIMARY KEY (`user_name`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `FK_classroom_id` (`classroom_id`),
  CONSTRAINT `FK_classroom_id` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_attempt`
--

DROP TABLE IF EXISTS `work_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_attempt` (
  `student_name` varchar(16) NOT NULL,
  `assignment_id` mediumint NOT NULL,
  `completion_date` timestamp NOT NULL,
  `correct_answers` json NOT NULL,
  `num_questions_attempted` smallint unsigned NOT NULL,
  `num_questions_correct` smallint unsigned NOT NULL,
  PRIMARY KEY (`student_name`,`assignment_id`,`completion_date`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `work_attempt_ibfk_1` FOREIGN KEY (`student_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `work_attempt_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignment_work` (`id`),
  CONSTRAINT `work_attempt_chk_1` CHECK ((`num_questions_correct` <= `num_questions_attempted`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_question`
--

DROP TABLE IF EXISTS `work_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_question` (
  `assignment_id` mediumint NOT NULL,
  `question_id` mediumint NOT NULL,
  `max_attempts` tinyint unsigned NOT NULL,
  `allow_hints` tinyint(1) NOT NULL,
  `question_number` smallint NOT NULL,
  PRIMARY KEY (`assignment_id`,`question_id`,`question_number`),
  KEY `FK_question_id` (`question_id`),
  CONSTRAINT `FK_assignment_id` FOREIGN KEY (`assignment_id`) REFERENCES `assignment_work` (`id`),
  CONSTRAINT `FK_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-10 12:06:21
