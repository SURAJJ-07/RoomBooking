<?php
// user/check_availability.php
include("../db.php");

if (isset($_POST['room_id']) && isset($_POST['checkin'])) {

    $room_id = mysqli_real_escape_string($conn, $_POST['room_id']);
    $checkin = mysqli_real_escape_string($conn, $_POST['checkin']);

    // Check if room already booked on the same date
    $query = "
        SELECT id FROM bookings
        WHERE room_id = '$room_id'
        AND checkin = '$checkin'
    ";

    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        echo "<span class='not-available'>❌ Room already booked</span>";
    } else {
        echo "<span class='available'>✅ Room available</span>";
    }
}
?>
