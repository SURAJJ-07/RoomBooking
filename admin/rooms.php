<?php
session_start();
include "../db.php";
if (!isset($_SESSION['admin'])) header("Location: login.php");

$result = $conn->query("SELECT * FROM rooms");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Rooms</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
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
    <td><?= $row['id'] ?></td>
    <td><?= $row['room_type'] ?></td>
    <td><?= $row['price'] ?></td>
    <td><?= $row['address'] ?></td>
    <td><?= $row['status'] ?></td>
</tr>
<?php endwhile; ?>
</table>
</body>
</html>
