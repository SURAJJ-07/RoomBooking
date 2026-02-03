<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

require_once "../db.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $room_type = trim($_POST['room_type']);
    $address   = trim($_POST['address']);
    $price     = trim($_POST['price']);

    if ($room_type && $address && $price) {
        $stmt = $conn->prepare(
            "INSERT INTO rooms (room_type, address, price) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("ssi", $room_type, $address, $price);

        if ($stmt->execute()) {
            $message = "Room added successfully";
        } else {
            $message = "Database error";
        }
    } else {
        $message = "All fields are required";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Add Room</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>

<div class="container small">
    <h2>Add Room</h2>

    <?php if ($message): ?>
        <p class="msg"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <form method="POST">
        <input type="text" name="room_type" placeholder="Room Type (2BHK, 3BHK)" required>
        <input type="text" name="address" placeholder="Room Address" required>
        <input type="number" name="price" placeholder="Price" required>
        <button type="submit">Add Room</button>
    </form>
</div>

</body>
</html>
