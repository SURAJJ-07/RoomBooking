<?php
session_start();
require_once "db.php";

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: rooms.php");
    exit;
}

$id = $_POST['id'] ?? null;

if ($id && ctype_digit((string)$id)) {
    $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM bookings WHERE room_id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $count = $check->get_result()->fetch_assoc()['cnt'];

    if ($count > 0) {
        header("Location: rooms.php?error=has_bookings");
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM rooms WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
}

header("Location: rooms.php");
exit;
