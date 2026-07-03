<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request");
}

$name    = trim($_POST['name'] ?? '');
$room_id = trim($_POST['room_id'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$checkin = trim($_POST['checkin_date'] ?? '');

if ($name === '' || $room_id === '' || $contact === '' || $checkin === '') {
    die("All fields are required");
}
if (!ctype_digit($room_id)) {
    die("Invalid room selected");
}
if (!preg_match('/^[0-9]{10}$/', $contact)) {
    die("Contact number must be exactly 10 digits");
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $checkin)) {
    die("Invalid check-in date");
}

$today = date('Y-m-d');
if ($checkin < $today) {
    die("Check-in date cannot be in the past");
}

$stmt = $conn->prepare("INSERT INTO bookings (name, room_id, contact, checkin_date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("siss", $name, $room_id, $contact, $checkin);

if (!$stmt->execute()) {
    die("Booking failed: " . $stmt->error);
}

$update = $conn->prepare("UPDATE rooms SET status = 'booked' WHERE id = ?");
$update->bind_param("i", $room_id);
$update->execute();

header("Location: booking_success.php");
exit;
