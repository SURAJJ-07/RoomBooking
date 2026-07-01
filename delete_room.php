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
    $stmt = $conn->prepare("DELETE FROM rooms WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
}

header("Location: rooms.php");
exit;
