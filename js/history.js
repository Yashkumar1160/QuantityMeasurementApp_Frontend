// Function to render table data on UI
function renderTable(rows) {

    // Get table body element
    var tbody = document.getElementById("hist-tbody");

    // Clear previous data
    tbody.innerHTML = "";

    // If no data found, show empty message
    if (!rows || rows.length === 0) {
        tbody.innerHTML =
            "<tr><td colspan='6'>" +
            "<div class='empty-state'>" +
            "<div class='empty-icon'>📋</div>" +
            "<p>No records found.</p>" +
            "</div>" +
            "</td></tr>";
        return;
    }

    // Loop through each record (row)
    rows.forEach(function(r) {

        // Create new table row
        var tr = document.createElement("tr");

        // Show status badge (Error or OK)
        var statusBadge = r.isError
            ? "<span class='badge badge-error'>Error</span>"
            : "<span class='badge badge-ok'>OK</span>";

        // If error → show dash, else show values with units
        var input1 = r.isError ? "—" : (r.thisValue + " " + (r.thisUnit || ""));
        var input2 = r.isError ? "—" : (r.thatValue + " " + (r.thatUnit || ""));

        // Show result or error message
        var result = r.isError
            ? (r.errorMessage || "Error")
            : (r.resultValue + " " + (r.resultUnit || ""));

        // Set row HTML content
        tr.innerHTML =
            "<td>" + statusBadge + "</td>" + // status column
            "<td><span class='badge badge-op'>" + (r.operation || "-") + "</span></td>" + // operation
            "<td>" + (r.thisMeasurementType || r.thatMeasurementType || "—") + "</td>" + // type
            "<td>" + input1 + "</td>" + // first input
            "<td>" + input2 + "</td>" + // second input
            "<td class='mono'>" + result + "</td>"; // result

        // Add row to table
        tbody.appendChild(tr);
    });
}

// Function to load history from API
function loadHistory() {

    // Get selected filter type and value
    var filterBy  = document.getElementById("filter-by").value;
    var filterVal = document.getElementById("filter-val").value;

    var path; // API endpoint

    // Decide API path based on filter
    if (filterBy === "operation") {
        path = "/quantities/history/operation/" + (filterVal || "Compare");
    } 
    else if (filterBy === "type") {
        path = "/quantities/history/type/" + (filterVal || "Length");
    } 
    else {
        path = "/quantities/history/errored";
    }

    // Show loading message in table
    document.getElementById("hist-tbody").innerHTML =
        "<tr><td colspan='6' class='loading-cell'>Loading...</td></tr>";

    // Call API (GET request)
    apiCall("GET", path)
        .then(function(data) {
            // If success → render table
            renderTable(data);
        })
        .catch(function() {
            // If error → show error message
            document.getElementById("hist-tbody").innerHTML =
                "<tr><td colspan='6' class='error-cell'>Failed to load. Is the API running?</td></tr>";
        });
}

// Function triggered when filter type changes
function onFilterByChange() {

    // Get selected filter type
    var filterBy  = document.getElementById("filter-by").value;

    // Get dropdown for filter values
    var valSelect = document.getElementById("filter-val");

    // Clear previous options
    valSelect.innerHTML = "";

    // Available operations
    var ops   = ["Compare", "Convert", "Add", "Subtract", "Divide"];

    // Available measurement types
    var types = ["Length", "Weight", "Volume", "Temperature"];

    // If filter is operation or type → show dropdown
    if (filterBy === "operation" || filterBy === "type") {

        // Choose correct list
        (filterBy === "operation" ? ops : types).forEach(function(item) {

            // Create option element
            var opt = document.createElement("option");

            opt.value = item;        // value sent to API
            opt.textContent = item;  // text shown in UI

            // Add option to dropdown
            valSelect.appendChild(opt);
        });

        // Show dropdown
        valSelect.style.display = "block";
    } 
    else {
        // Hide dropdown if not needed
        valSelect.style.display = "none";
    }
}

// Runs when page loads
document.addEventListener("DOMContentLoaded", function() {

    // Check if user is logged in
    requireLogin();

    // Show username in navbar
    document.getElementById("navbar-user").textContent = "Hi, " + getUserName();

    // Logout button click event
    document.getElementById("logout-btn").addEventListener("click", logout);

    // When filter type changes
    document.getElementById("filter-by").addEventListener("change", onFilterByChange);

    // When "Load" button clicked
    document.getElementById("load-btn").addEventListener("click", loadHistory);

    // Load history automatically on page load
    loadHistory();
});