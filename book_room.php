<?php
require_once "db.php";

$result = mysqli_query($conn,
    "SELECT id, room_type, price FROM rooms WHERE status='available'"
);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Book Room</title>
    <link rel="stylesheet" href="style.css">
    <script>
        function showPrice() {
            const select = document.getElementById("room_id");
            const price = select.options[select.selectedIndex].dataset.price;
            document.getElementById("priceBox").innerText = "Price: Rs " + price;
        }
    </script>
</head>
<body>

<div class="container">
    <h2>Available Rooms</h2>

    <form method="POST" action="save_booking.php">

        <label>Your Name</label>
        <input type="text" name="name" required>

        <label>Select Room</label>
        <select name="room_id" id="room_id" onchange="showPrice()" required>
            <option value="">-- Select Room --</option>
            <?php while($row = mysqli_fetch_assoc($result)): ?>
                <option
                    value="<?= htmlspecialchars($row['id']); ?>"
                    data-price="<?= htmlspecialchars($row['price']); ?>">
                    <?= htmlspecialchars($row['room_type']); ?>
                </option>
            <?php endwhile; ?>
        </select>

        <p id="priceBox" style="font-weight:bold;"></p>

        <label>Check-in Date</label>
        <input type="date" name="checkin_date" required>

        <label>Contact Number</label>
        <input type="text" name="contact" pattern="[0-9]{10}" maxlength="10" required>

        <button type="submit">Confirm Booking</button>
    </form>

    <div class="nav">
        <a href="index.php">Back to Home</a>
    </div>
</div>

</body>
</html>
