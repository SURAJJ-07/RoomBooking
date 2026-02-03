<?php
include "../db.php";

$type = $_GET['type'];

$q = mysqli_query($conn,
    "SELECT * FROM rooms 
     WHERE room_type='$type' AND status='available'"
);

if (mysqli_num_rows($q) > 0) {
    echo "<span style='color:green;'>Rooms Available</span>";
} else {
    echo "<span style='color:red;'>No Rooms Available</span>";
}
?>
