-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2022 at 02:04 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_com`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `username` varchar(128) NOT NULL,
  `product_name` varchar(256) NOT NULL,
  `product_description` varchar(256) NOT NULL,
  `price` int(11) NOT NULL,
  `category` varchar(128) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `product_satutus` tinyint(1) NOT NULL DEFAULT 0,
  `phone` bigint(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `username`, `product_name`, `product_description`, `price`, `category`, `quantity`, `date`, `product_satutus`, `phone`) VALUES
(2, 'polikulo', 'tokk', 'small one', 0, 'rough', 1, '2022-01-16 17:26:50', 0, 9744018425);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `otp` int(4) NOT NULL,
  `phone` bigint(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`id`, `otp`, `phone`, `time`) VALUES
(1, 6874, 9744019425, '2022-01-14 18:02:14'),
(2, 7462, 9744019425, '2022-01-15 10:39:17'),
(3, 2130, 6235518333, '2022-01-15 14:14:04'),
(4, 1388, 6235518333, '2022-01-15 14:17:10');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `prdct_id` int(11) NOT NULL,
  `product_name` varchar(128) NOT NULL,
  `price` int(11) NOT NULL,
  `quantitiy` int(11) NOT NULL,
  `category` varchar(128) NOT NULL,
  `product_image` text NOT NULL,
  `product_description` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`prdct_id`, `product_name`, `price`, `quantitiy`, `category`, `product_image`, `product_description`) VALUES
(1, 'tokk', 3008, 1, 'rough', '[\"8977f26f-fdc4-44f3-8795-4965e0a27d06.jpg\"]', 'small amzing'),
(2, 'topp', 3089, 1, 'rough', '[\"566a215e-4c77-4281-ab36-b1221beb91a7.jpg\"]', 'small amzing');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(128) DEFAULT NULL,
  `phone` bigint(10) NOT NULL,
  `password` varchar(256) NOT NULL,
  `name` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `id` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `phone`, `password`, `name`, `email`, `id`, `status`) VALUES
('polikulo', 9744019425, '$2b$10$hhN.yLoObG/j3wSCA8ykZufAzN8xjJx2kkQEH6QI61cbwP4Tpk5vu', 'koli', 'poliku@polo.com', 2, 1),
('polik', 6235518333, '$2b$10$Y/pVaPpz8WthYMvRN9MQmeLLwC63irvuX1nGH4KKUuoDyJJJZct.W', 'koli', 'epol@epolop.com', 4, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`prdct_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `prdct_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
