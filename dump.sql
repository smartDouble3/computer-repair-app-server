-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: repair_app
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'technician',
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Alice','alice@repair.local','080-111-1111','technician',NULL,'2025-09-04 05:13:34'),(2,'Bob','bob@repair.local','080-222-2222','technician',NULL,'2025-09-04 05:13:34'),(3,'Carol','carol@repair.local','080-333-3333','reception',NULL,'2025-09-04 05:13:34'),(4,'Dave','dave@repair.local','080-444-4444','technician','/uploads/employees/1757314234768_828395ixq0x.jpg','2025-09-04 05:17:32'),(7,'smart','sakson11223344@gmal.com','0999999','technician',NULL,'2025-09-08 13:14:01');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `device_brand` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_model` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('OPEN','IN_PROGRESS','DONE','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `assigned_employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tickets_employee` (`assigned_employee_id`),
  KEY `idx_tickets_status_created` (`status`,`created_at`),
  KEY `idx_tickets_user_created` (`user_id`,`created_at`),
  CONSTRAINT `fk_tickets_employee` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,'เปลี่ยน SSD','โอนไฟล์เดิมด้วย','Lenovo','IdeaPad','OPEN','2025-09-04 05:26:46','2025-09-04 05:26:46',NULL,1),(2,1,'เปลี่ยน SSD','โอนไฟล์เดิมด้วย','Lenovo','IdeaPad','OPEN','2025-09-04 05:27:25','2025-09-04 05:27:25',NULL,1),(15,16,'sdfsad','fasdfs','fasdfsadf','sdfsadffas','OPEN','2025-09-08 08:27:21','2025-09-08 08:27:21',NULL,1),(16,18,'ไม่ติด','ไม่ติด','mac','m4','OPEN','2025-09-08 09:57:14','2025-09-08 09:57:14',NULL,1),(17,18,'gg','gg','gg','gg','OPEN','2025-09-08 09:57:45','2025-09-08 09:57:45',NULL,1),(18,19,'sss','sss','ss','ss','OPEN','2025-09-08 11:30:09','2025-09-08 11:30:09',NULL,3),(19,18,'[MEDIUM] LAPTOP - asdf','=== ผู้แจ้ง/ติดต่อ ===\nชื่อผู้ติดต่อ: fdsfasd\nโทรศัพท์: 000991320412934\nอีเมล: 11223344@gamil.com\nแผนก/หน่วยงาน: asdfs\nสถานที่: asdfasdf\nความเร่งด่วน: MEDIUM\n\n=== อุปกรณ์ ===\nประเภท: LAPTOP\nยี่ห้อ (ย่อ): asdf\nโมเดล: fasdaf\n\n=== รายละเอียดปัญหา ===\ndffads','asdf','fasdaf','OPEN','2025-09-09 00:21:22','2025-09-09 00:21:22',NULL,NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'March','march@example.com',NULL,NULL,NULL,'$2a$10$uIV.DTn6PfxmZqf1Jf6VuOycG96tXW0NEw9Qshcksa7xGgKZ6p9r2','admin','2025-09-04 05:05:23'),(14,'Admin One','admin@example.com','0800000000',NULL,'/uploads/avatars/1757320277085_7kopz2man7a.png','$2a$10$AP4V/oYfdClgJ2XC.o3/O.8LP.coZBIaELk45UX0odgr/2se/1n7i','admin','2025-09-08 07:21:04'),(15,'smart','sakson11223344@gmail.com','0660144627',NULL,NULL,'$2a$10$PwLrPuMpAAQIVMS62LsEQOan6Cw0XqRN3HzZtkU.JNlsrV4qmOBGW','user','2025-09-08 08:05:26'),(16,'me','1234@gmail.com','0800000000',NULL,'/uploads/avatars/1757319985974_fmm1yx80ejc.png','$2a$10$6qF.SxCfoboDv1fGjhcWQOFqEU1sni3Zz3MOWtY0.PKl7S9uRKD7S','user','2025-09-08 08:25:56'),(17,'TestUserX','testuser201@example.com','0800000000',NULL,NULL,'$2a$10$nx056y6R2QJ5to25NbySKOcA3tGyb86UfIyQreyHZEagXwKucknBm','user','2025-09-08 09:51:10'),(18,'my','11223344@gmail.com','1122334455',NULL,NULL,'$2a$10$RDiizGO2PfkHs1YDGI2bP.SJ40sET9whOBsgTeRJ6v2P6mUvtCwqu','user','2025-09-08 09:53:07'),(19,'Admin smart','smart@example.com','0200000000',NULL,'/uploads/avatars/1757330991915_fgqmv9lyjkp.jpg','$2a$10$b6gqQLwLSU746UxL7uiZXO8gRRnYrNHYdXxYvdyKXembGCJ2s8gx6','admin','2025-09-08 10:02:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-09  9:20:03
