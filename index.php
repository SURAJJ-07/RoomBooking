<?php
session_start();
require_once "db.php";

$isAdmin = isset($_SESSION['admin']);
?>
<!DOCTYPE html>
<html>
<head>
    <title><?= $isAdmin ? "Admin Dashboard" : "Hostel Booking" ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <?php if ($isAdmin): ?>
        <h1>Admin Dashboard</h1>
        <div class="nav">
            <a href="rooms.php">View Rooms</a>
            <a href="add_room.php">Add Room</a>
            <a href="bookings.php">View Bookings</a>
            <a href="logout.php">Logout (<?= htmlspecialchars($_SESSION['admin']) ?>)</a>
        </div>
    <?php else: ?>
        <h1>Welcome to Hostel Booking</h1>
        <form action="book_room.php" method="GET">
            <button type="submit">Check Available Rooms</button>
        </form>
        <div class="nav">
            <a href="login.php">Admin Login</a>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
