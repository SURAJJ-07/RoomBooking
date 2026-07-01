<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

$id = $_GET['id'] ?? $_POST['id'] ?? null;

if (!$id || !ctype_digit((string)$id)) {
    die("Invalid room ID");
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $room_type = trim($_POST['room_type'] ?? '');
    $address   = trim($_POST['address'] ?? '');
    $price     = trim($_POST['price'] ?? '');
    $status    = $_POST['status'] ?? 'available';

    if ($room_type && $address && $price && in_array($status, ['available', 'booked'], true)) {
        $stmt = $conn->prepare(
            "UPDATE rooms SET room_type = ?, address = ?, price = ?, status = ? WHERE id = ?"
        );
        $stmt->bind_param("ssisi", $room_type, $address, $price, $status, $id);

        if ($stmt->execute()) {
            header("Location: rooms.php");
            exit;
        } else {
            $message = "Database error";
        }
    } else {
        $message = "All fields are required";
    }
}

$stmt = $conn->prepare("SELECT * FROM rooms WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$room = $stmt->get_result()->fetch_assoc();

if (!$room) {
    die("Room not found");
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Edit Room</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Edit Room</h2>

    <?php if ($message): ?>
        <p class="error"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <form method="POST">
        <input type="hidden" name="id" value="<?= htmlspecialchars($room['id']) ?>">

        <label>Room Type</label>
        <input type="text" name="room_type" value="<?= htmlspecialchars($room['room_type']) ?>" required>

        <label>Address</label>
        <input type="text" name="address" value="<?= htmlspecialchars($room['address']) ?>" required>

        <label>Price</label>
        <input type="number" name="price" value="<?= htmlspecialchars($room['price']) ?>" required>

        <label>Status</label>
        <select name="status">
            <option value="available" <?= $room['status'] === 'available' ? 'selected' : '' ?>>Available</option>
            <option value="booked" <?= $room['status'] === 'booked' ? 'selected' : '' ?>>Booked</option>
        </select>

        <button type="submit">Save Changes</button>
    </form>

    <div class="nav">
        <a href="rooms.php">Back to Rooms</a>
    </div>
</div>

</body>
</html>
