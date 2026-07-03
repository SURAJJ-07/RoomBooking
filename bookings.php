<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

$sql = "SELECT b.*, r.room_type
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        ORDER BY b.id DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Bookings</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container-wide">
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
    <td><?= htmlspecialchars($row['name']) ?></td>
    <td><?= htmlspecialchars($row['room_type']) ?></td>
    <td><?= htmlspecialchars($row['contact']) ?></td>
    <td><?= htmlspecialchars($row['checkin_date']) ?></td>
</tr>
<?php endwhile; ?>
</table>
<div class="nav">
    <a href="index.php">Back to Panel</a>
</div>
</div>
</body>
</html>
