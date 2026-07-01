<?php
require_once "db.php";

if (isset($_GET['ajax'])) {
    header('Content-Type: application/json');

    $keyword = trim($_GET['keyword'] ?? '');
    $min     = trim($_GET['min'] ?? '');
    $max     = trim($_GET['max'] ?? '');

    $sql = "SELECT id, room_type, address, price, status FROM rooms WHERE 1=1";
    $types = "";
    $params = [];

    if ($keyword !== '') {
        $sql .= " AND (room_type LIKE ? OR address LIKE ?)";
        $like = "%$keyword%";
        $types .= "ss";
        $params[] = $like;
        $params[] = $like;
    }

    if ($min !== '' && is_numeric($min)) {
        $sql .= " AND price >= ?";
        $types .= "i";
        $params[] = (int)$min;
    }

    if ($max !== '' && is_numeric($max)) {
        $sql .= " AND price <= ?";
        $types .= "i";
        $params[] = (int)$max;
    }

    $sql .= " ORDER BY price ASC";

    $stmt = $conn->prepare($sql);
    if ($types !== "") {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }

    echo json_encode($rooms);
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Search Rooms</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container-wide">
    <h2>Search Rooms</h2>

    <form id="searchForm" onsubmit="return false;">
        <label>Keyword (type or address)</label>
        <input type="text" id="keyword" placeholder="e.g. BHK, Chabhil">

        <label>Min Price</label>
        <input type="number" id="min" placeholder="0">

        <label>Max Price</label>
        <input type="number" id="max" placeholder="No limit">

        <button type="button" onclick="runSearch()">Search</button>
    </form>

    <p id="status" style="margin-top:16px;"></p>

    <table id="resultsTable" style="display:none;">
        <tr>
            <th>Type</th>
            <th>Address</th>
            <th>Price</th>
            <th>Status</th>
        </tr>
        <tbody id="resultsBody"></tbody>
    </table>

    <div class="nav">
        <a href="index.php">Back to Home</a>
    </div>
</div>

<script>
function runSearch() {
    const keyword = document.getElementById('keyword').value;
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;
    const status = document.getElementById('status');
    const table = document.getElementById('resultsTable');
    const body = document.getElementById('resultsBody');

    status.textContent = "Searching...";

    const params = new URLSearchParams({ ajax: 1, keyword, min, max });

    fetch('search.php?' + params.toString())
        .then(res => res.json())
        .then(rooms => {
            body.innerHTML = "";

            if (rooms.length === 0) {
                status.textContent = "No rooms match your search.";
                table.style.display = "none";
                return;
            }

            status.textContent = rooms.length + " room(s) found.";
            table.style.display = "table";

            rooms.forEach(r => {
                const tr = document.createElement('tr');

                const tdType = document.createElement('td');
                tdType.textContent = r.room_type;

                const tdAddr = document.createElement('td');
                tdAddr.textContent = r.address;

                const tdPrice = document.createElement('td');
                tdPrice.textContent = "Rs " + r.price;

                const tdStatus = document.createElement('td');
                tdStatus.textContent = r.status;
                tdStatus.className = "status-" + r.status;

                tr.appendChild(tdType);
                tr.appendChild(tdAddr);
                tr.appendChild(tdPrice);
                tr.appendChild(tdStatus);
                body.appendChild(tr);
            });
        })
        .catch(() => {
            status.textContent = "Search failed. Try again.";
        });
}

let debounce;
document.getElementById('keyword').addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(runSearch, 300);
});

runSearch();
</script>

</body>
</html>
