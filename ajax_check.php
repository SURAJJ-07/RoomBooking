<?php
require_once "db.php";

$type = $_GET['type'] ?? '';

$stmt = $conn->prepare(
    "SELECT * FROM rooms WHERE room_type = ? AND status = 'available'"
);
$stmt->bind_param("s", $type);
$stmt->execute();
$q = $stmt->get_result();

if ($q->num_rows > 0) {
    echo "<span style='color:green;'>Rooms Available</span>";
} else {
    echo "<span style='color:red;'>No Rooms Available</span>";
}
?>
