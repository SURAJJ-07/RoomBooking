<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: bookings.php");
    exit;
}

$id = $_POST['id'] ?? null;

if ($id && ctype_digit((string)$id)) {
    $stmt = $conn->prepare("SELECT room_id FROM bookings WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $booking = $stmt->get_result()->fetch_assoc();

    $del = $conn->prepare("DELETE FROM bookings WHERE id = ?");
    $del->bind_param("i", $id);
    $del->execute();

    if ($booking) {
        $freeRoom = $conn->prepare("UPDATE rooms SET status = 'available' WHERE id = ?");
        $freeRoom->bind_param("i", $booking['room_id']);
        $freeRoom->execute();
    }
}

header("Location: bookings.php");
exit;
