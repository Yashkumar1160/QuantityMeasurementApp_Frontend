
// Hides all panels and deactivates all sidebar buttons, 
// then shows only the panel and button matching the given name. 
// The panel ID is built as "section-" + name (e.g. "section-compare"). 
// The sidebar button is found using an attribute selector. 
// If navigating home, stats are refreshed.
function showSection(name) {
    document.querySelectorAll(".section-panel").forEach(function(p) { p.classList.remove("active"); });
    document.querySelectorAll(".sidebar-btn").forEach(function(b) { b.classList.remove("active"); });

    document.getElementById("section-" + name).classList.add("active");

    var activeBtn = document.querySelector(".sidebar-btn[data-section='" + name + "']");
    if (activeBtn) activeBtn.classList.add("active");

    if (name === "home") loadStats();
}


// .map() loops through OPERATIONS and starts a parallel API call for each one, 
// returning an array of Promises. 
// Each .then() updates its stat card when the count arrives. 
// Promise.all(requests) waits for every single call to finish, 
// then sets the total. 
// This is more efficient than waiting for each call sequentially.
function loadStats() {
    var total = 0;

    var requests = OPERATIONS.map(function(op) {
        return apiCall("GET", "/quantities/count/" + op)
            .then(function(count) {
                var el = document.getElementById("stat-" + op.toLowerCase());
                if (el) el.textContent = count;
                total += count;
            })
            .catch(function() {
                var el = document.getElementById("stat-" + op.toLowerCase());
                if (el) el.textContent = 0;
            });
    });

    Promise.all(requests).then(function() {
        document.getElementById("stat-total").textContent = total;
    });
}


// ----OPERATION HANDLERS------
// Compare
function handleCompare() {
    // validate fields
    var v1Ok   = validateField("cmp-val1",  "cmp-val1-err",  "Enter a value");
    var typeOk = validateSelect("cmp-type", "cmp-type-err",  "Select a type");
    var u1Ok   = validateSelect("cmp-unit1","cmp-unit1-err", "Select unit");
    var v2Ok   = validateField("cmp-val2",  "cmp-val2-err",  "Enter a value");
    var u2Ok   = validateSelect("cmp-unit2","cmp-unit2-err", "Select unit");
    if (!v1Ok || !typeOk || !u1Ok || !v2Ok || !u2Ok) return;

    var type = document.getElementById("cmp-type").value;

    // Build the request body in the exact shape the backend expects
    var body = {
        thisQuantityDTO: new Quantity(document.getElementById("cmp-val1").value, document.getElementById("cmp-unit1").value, type).toDTO(),
        thatQuantityDTO: new Quantity(document.getElementById("cmp-val2").value, document.getElementById("cmp-unit2").value, type).toDTO()
    };

    var btn = document.getElementById("cmp-btn");
    setLoading(btn, true);

    apiCall("POST", "/quantities/compare", body)
        // stop loading 
        .then(function(data) {
            // show result or error
            setLoading(btn, false);
            showResult("cmp-result", data.resultString || (data.isError ? data.errorMessage : String(data.resultValue)), data.isError);
        })
        .catch(function(err) {
            setLoading(btn, false);
            showResult("cmp-result", (err && err.message) ? err.message : "Compare failed.", true);
        });
}


function handleConvert() {
    var valOk  = validateField("conv-val",   "conv-val-err",  "Enter a value");
    var typeOk = validateSelect("conv-type", "conv-type-err", "Select a type");
    var fromOk = validateSelect("conv-from", "conv-from-err", "Select from unit");
    var toOk   = validateSelect("conv-to",   "conv-to-err",   "Select to unit");
    if (!valOk || !typeOk || !fromOk || !toOk) return;

    var body = {
        thisQuantityDTO: buildQty(
            document.getElementById("conv-val").value,
            document.getElementById("conv-from").value,
            document.getElementById("conv-type").value
        ),
        targetUnit: document.getElementById("conv-to").value
    };

    var btn = document.getElementById("conv-btn");
    setLoading(btn, true);

    apiCall("POST", "/quantities/convert", body)
        .then(function(data) {
            setLoading(btn, false);
            showResult("conv-result", data.resultString || (data.resultValue + " " + (data.resultUnit || "")), data.isError);
        })
        .catch(function(err) {
            setLoading(btn, false);
            showResult("conv-result", (err && err.message) ? err.message : "Convert failed.", true);
        });
}


function handleAdd() {
    var v1Ok     = validateField("add-val1",   "add-val1-err",   "Enter a value");
    var typeOk   = validateSelect("add-type",  "add-type-err",   "Select a type");
    var u1Ok     = validateSelect("add-unit1", "add-unit1-err",  "Select unit");
    var v2Ok     = validateField("add-val2",   "add-val2-err",   "Enter a value");
    var u2Ok     = validateSelect("add-unit2", "add-unit2-err",  "Select unit");
    var targetOk = validateSelect("add-target","add-target-err", "Select result unit");
    if (!v1Ok || !typeOk || !u1Ok || !v2Ok || !u2Ok || !targetOk) return;

    var type = document.getElementById("add-type").value;
    var body = {
        thisQuantityDTO: buildQty(document.getElementById("add-val1").value, document.getElementById("add-unit1").value, type),
        thatQuantityDTO: buildQty(document.getElementById("add-val2").value, document.getElementById("add-unit2").value, type),
        targetUnit: document.getElementById("add-target").value
    };

    var btn = document.getElementById("add-btn");
    setLoading(btn, true);

    apiCall("POST", "/quantities/add", body)
        .then(function(data) {
            setLoading(btn, false);
            showResult("add-result", data.resultString || (data.resultValue + " " + (data.resultUnit || "")), data.isError);
        })
        .catch(function(err) {
            setLoading(btn, false);
            showResult("add-result", (err && err.message) ? err.message : "Add failed.", true);
        });
}


function handleSubtract() {
    var v1Ok     = validateField("sub-val1",   "sub-val1-err",   "Enter a value");
    var typeOk   = validateSelect("sub-type",  "sub-type-err",   "Select a type");
    var u1Ok     = validateSelect("sub-unit1", "sub-unit1-err",  "Select unit");
    var v2Ok     = validateField("sub-val2",   "sub-val2-err",   "Enter a value");
    var u2Ok     = validateSelect("sub-unit2", "sub-unit2-err",  "Select unit");
    var targetOk = validateSelect("sub-target","sub-target-err", "Select result unit");
    if (!v1Ok || !typeOk || !u1Ok || !v2Ok || !u2Ok || !targetOk) return;

    var type = document.getElementById("sub-type").value;
    var body = {
        thisQuantityDTO: buildQty(document.getElementById("sub-val1").value, document.getElementById("sub-unit1").value, type),
        thatQuantityDTO: buildQty(document.getElementById("sub-val2").value, document.getElementById("sub-unit2").value, type),
        targetUnit: document.getElementById("sub-target").value
    };

    var btn = document.getElementById("sub-btn");
    setLoading(btn, true);

    apiCall("POST", "/quantities/subtract", body)
        .then(function(data) {
            setLoading(btn, false);
            showResult("sub-result", data.resultString || (data.resultValue + " " + (data.resultUnit || "")), data.isError);
        })
        .catch(function(err) {
            setLoading(btn, false);
            showResult("sub-result", (err && err.message) ? err.message : "Subtract failed.", true);
        });
}


function handleDivide() {
    var v1Ok   = validateField("div-val1",   "div-val1-err",  "Enter a value");
    var typeOk = validateSelect("div-type",  "div-type-err",  "Select a type");
    var u1Ok   = validateSelect("div-unit1", "div-unit1-err", "Select unit");
    var v2Ok   = validateField("div-val2",   "div-val2-err",  "Enter a value");
    var u2Ok   = validateSelect("div-unit2", "div-unit2-err", "Select unit");
    if (!v1Ok || !typeOk || !u1Ok || !v2Ok || !u2Ok) return;

    var type = document.getElementById("div-type").value;
    var body = {
        thisQuantityDTO: buildQty(document.getElementById("div-val1").value, document.getElementById("div-unit1").value, type),
        thatQuantityDTO: buildQty(document.getElementById("div-val2").value, document.getElementById("div-unit2").value, type)
    };

    var btn = document.getElementById("div-btn");
    setLoading(btn, true);

    apiCall("POST", "/quantities/divide", body)
        .then(function(data) {
            setLoading(btn, false);
            showResult("div-result", data.resultString || ("Result: " + data.resultValue), data.isError);
        })
        .catch(function(err) {
            setLoading(btn, false);
            showResult("div-result", (err && err.message) ? err.message : "Divide failed.", true);
        });
}


document.addEventListener("DOMContentLoaded", function() {
    requireLogin();

    document.getElementById("navbar-user").textContent = "Hi, " + getUserName();
    document.getElementById("logout-btn").addEventListener("click", logout);

    document.querySelectorAll(".sidebar-btn[data-section]").forEach(function(btn) {
        btn.addEventListener("click", function() { showSection(this.dataset.section); });
    });

    wireTypeToUnit("cmp-type", "cmp-unit1");
    wireTypeToUnit("cmp-type", "cmp-unit2");
    document.getElementById("cmp-btn").addEventListener("click", handleCompare);

    document.getElementById("conv-type").addEventListener("change", function() {
        var units = UNITS[this.value] || [];
        fillSelect("conv-from", units);
        fillSelect("conv-to", units);
    });
    document.getElementById("conv-btn").addEventListener("click", handleConvert);

    wireTypeToUnit("add-type", "add-unit1");
    wireTypeToUnit("add-type", "add-unit2");
    wireTypeToUnit("add-type", "add-target");
    document.getElementById("add-btn").addEventListener("click", handleAdd);

    wireTypeToUnit("sub-type", "sub-unit1");
    wireTypeToUnit("sub-type", "sub-unit2");
    wireTypeToUnit("sub-type", "sub-target");
    document.getElementById("sub-btn").addEventListener("click", handleSubtract);

    wireTypeToUnit("div-type", "div-unit1");
    wireTypeToUnit("div-type", "div-unit2");
    document.getElementById("div-btn").addEventListener("click", handleDivide);

    loadStats();
});
