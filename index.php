<?php
session_start();
require_once "db.php";

$isAdmin = isset($_SESSION['admin']);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hostel Booking</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h1>Welcome to Hostel Booking</h1>

    <form action="book_room.php" method="GET">
        <button type="submit">Check Available Rooms</button>
    </form>

    <div class="nav">
        <?php if ($isAdmin): ?>
            <a href="rooms.php">View Rooms</a>
            <a href="add_room.php">Add Room</a>
            <a href="bookings.php">View Bookings</a>
            <a href="logout.php">Logout (<?= htmlspecialchars($_SESSION['admin']) ?>)</a>
        <?php else: ?>
            <a href="login.php">Admin Login</a>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
