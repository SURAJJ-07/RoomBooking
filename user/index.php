<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include("../db.php");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Hostel Booking</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>

<div class="container">
    <h1>Welcome to Hostel Booking</h1>

    <form action="book_room.php" method="GET">
        <button type="submit">Check Available Rooms</button>
    </form>
</div>

</body>
</html>
