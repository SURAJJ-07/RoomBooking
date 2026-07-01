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
    <th>Actions</th>
</tr>
<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?= htmlspecialchars($row['id']) ?></td>
    <td><?= htmlspecialchars($row['room_type']) ?></td>
    <td><?= htmlspecialchars($row['price']) ?></td>
    <td><?= htmlspecialchars($row['address']) ?></td>
    <td class="status-<?= htmlspecialchars($row['status']) ?>"><?= htmlspecialchars($row['status']) ?></td>
    <td>
        <a href="edit_room.php?id=<?= htmlspecialchars($row['id']) ?>">Edit</a>
        <form action="delete_room.php" method="POST" style="display:inline" onsubmit="return confirm('Delete this room?');">
            <input type="hidden" name="id" value="<?= htmlspecialchars($row['id']) ?>">
            <button type="submit">Delete</button>
        </form>
    </td>
</tr>
<?php endwhile; ?>
</table>
<div class="nav">
    <a href="index.php">Back to Panel</a>
</div>
</div>
</body>
</html>
