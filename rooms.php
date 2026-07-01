<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

$result = $conn->query("SELECT * FROM rooms");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Rooms</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container-wide">
<h2>Rooms</h2>
<table>
<tr>
    <th>ID</th>
    <th>Type</th>
    <th>Price</th>
    <th>Address</th>
    <th>Status</th>
</tr>
<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?= htmlspecialchars($row['id']) ?></td>
    <td><?= htmlspecialchars($row['room_type']) ?></td>
    <td><?= htmlspecialchars($row['price']) ?></td>
    <td><?= htmlspecialchars($row['address']) ?></td>
    <td class="status-<?= htmlspecialchars($row['status']) ?>"><?= htmlspecialchars($row['status']) ?></td>
</tr>
<?php endwhile; ?>
</table>
<div class="nav">
    <a href="index.php">Back to Panel</a>
</div>
</div>
</body>
</html>
