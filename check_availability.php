<?php
require_once "db.php";

if (isset($_POST['room_id']) && isset($_POST['checkin'])) {

    $room_id = $_POST['room_id'];
    $checkin = $_POST['checkin'];

    $stmt = $conn->prepare(
        "SELECT id FROM bookings WHERE room_id = ? AND checkin_date = ?"
    );
    $stmt->bind_param("is", $room_id, $checkin);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<span class='not-available'>❌ Room already booked</span>";
    } else {
        echo "<span class='available'>✅ Room available</span>";
    }
}
?>
