<?php
$host = "localhost";
$user = "np03cs4a240011";
$pass = "c8nBHABPM4";
$db   = "np03cs4a240011";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>
