<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

$id = $_GET['id'] ?? $_POST['id'] ?? null;

if (!$id || !ctype_digit((string)$id)) {
    die("Invalid booking ID");
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = trim($_POST['name'] ?? '');
    $room_id = trim($_POST['room_id'] ?? '');
    $contact = trim($_POST['contact'] ?? '');
    $checkin = trim($_POST['checkin_date'] ?? '');

    if ($name === '' || !ctype_digit($room_id) || !preg_match('/^[0-9]{10}$/', $contact) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $checkin)) {
        $message = "Please fill all fields correctly (10-digit contact, valid date)";
    } else {
        $old = $conn->prepare("SELECT room_id FROM bookings WHERE id = ?");
        $old->bind_param("i", $id);
        $old->execute();
        $oldRoomId = $old->get_result()->fetch_assoc()['room_id'];

        $stmt = $conn->prepare(
            "UPDATE bookings SET name = ?, room_id = ?, contact = ?, checkin_date = ? WHERE id = ?"
        );
        $stmt->bind_param("sissi", $name, $room_id, $contact, $checkin, $id);

        if ($stmt->execute()) {
            $newStatus = $conn->prepare("UPDATE rooms SET status = 'booked' WHERE id = ?");
            $newStatus->bind_param("i", $room_id);
            $newStatus->execute();

            if ($oldRoomId != $room_id) {
                $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM bookings WHERE room_id = ?");
                $check->bind_param("i", $oldRoomId);
                $check->execute();
                $count = $check->get_result()->fetch_assoc()['cnt'];

                if ($count === 0) {
                    $freeOld = $conn->prepare("UPDATE rooms SET status = 'available' WHERE id = ?");
                    $freeOld->bind_param("i", $oldRoomId);
                    $freeOld->execute();
                }
            }

            header("Location: bookings.php");
            exit;
        } else {
            $message = "Database error";
        }
    }
}

$stmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
    die("Booking not found");
}

$rooms = $conn->query("SELECT id, room_type FROM rooms ORDER BY id");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Edit Booking</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Edit Booking</h2>

    <?php if ($message): ?>
        <p class="error"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <form method="POST">
        <input type="hidden" name="id" value="<?= htmlspecialchars($booking['id']) ?>">

        <label>Name</label>
        <input type="text" name="name" value="<?= htmlspecialchars($booking['name']) ?>" required>

        <label>Room</label>
        <select name="room_id" required>
            <?php while ($r = $rooms->fetch_assoc()): ?>
                <option value="<?= htmlspecialchars($r['id']) ?>" <?= $r['id'] == $booking['room_id'] ? 'selected' : '' ?>>
                    <?= htmlspecialchars($r['room_type']) ?> (ID <?= htmlspecialchars($r['id']) ?>)
                </option>
            <?php endwhile; ?>
        </select>

        <label>Check-in Date</label>
        <input type="date" name="checkin_date" value="<?= htmlspecialchars($booking['checkin_date']) ?>" required>

        <label>Contact Number</label>
        <input type="text" name="contact" value="<?= htmlspecialchars($booking['contact']) ?>" pattern="[0-9]{10}" maxlength="10" required>

        <button type="submit">Save Changes</button>
    </form>

    <div class="nav">
        <a href="bookings.php">Back to Bookings</a>
    </div>
</div>

</body>
</html>
