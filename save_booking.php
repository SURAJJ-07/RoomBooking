<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request");
}

$name      = $_POST['name'];
$room_id   = $_POST['room_id'];
$contact   = $_POST['contact'];
$checkin   = $_POST['checkin_date'];

/* Insert booking */
$insert = mysqli_query($conn,
    "INSERT INTO bookings (name, room_id, contact, checkin_date)
     VALUES ('$name', '$room_id', '$contact', '$checkin')"
);

if (!$insert) {
    die("Booking failed: " . mysqli_error($conn));
}

/* Mark room as booked */
mysqli_query($conn,
    "UPDATE rooms SET status='booked' WHERE id='$room_id'"
);

/* Redirect to success page */
header("Location: booking_success.php");
exit;
