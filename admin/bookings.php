<?php
session_start();
include "../db.php";
if (!isset($_SESSION['admin'])) header("Location: login.php");

$sql = "SELECT b.*, r.room_type 
        FROM bookings b 
        JOIN rooms r ON b.room_id = r.id";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Bookings</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
<h2>Bookings</h2>
<table>
<tr>
    <th>Name</th>
    <th>Room</th>
    <th>Contact</th>
    <th>Check-in</th>
</tr>
<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?= $row['name'] ?></td>
    <td><?= $row['room_type'] ?></td>
    <td><?= $row['contact'] ?></td>
    <td><?= $row['checkin_date'] ?></td>
</tr>
<?php endwhile; ?>
</table>
</body>
</html>
