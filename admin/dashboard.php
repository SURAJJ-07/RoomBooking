<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
<div class="container">
    <h2>Admin Dashboard</h2>
    <a href="add_room.php">Add Room</a>
    <a href="rooms.php">View Rooms</a>
    <a href="bookings.php">View Bookings</a>
    <a href="logout.php">Logout</a>
</div>
</body>
</html>
