// This file is loaded on every page and it contains reusable functions 

function apiCall(method, path, body) {
    // Builds full URL by joining API_BASE with specific path
    var url = API_BASE + path;

    // Creates settings object that fetch() needs 
    var options = {
        method: method,
        headers: { "Content-Type": "application/json" }
    };

    // After login the token is saved in sessionStorage
    var token = sessionStorage.getItem("token");
    // For every api call after that this reads the token and adds it to the request header
    if (token) options.headers["Authorization"] = "Bearer " + token;
    // If body object was passed it converts it to a json string and attaches it to the request
    if (body) options.body = JSON.stringify(body);

    return fetch(url, options).then(
        function(res) {
        return res.json().then(
            function(data) {
            if (!res.ok) throw data;
            return data;
        });
    });
}


// --- session ---
// After login or register backend sends back a token,name and email
// this saves all three into sessionStorage
function saveSession(data) {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("userName", data.name);
    sessionStorage.setItem("userEmail", data.email);
}

// Clears all stored data and sends the user back to login page
function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

// If no token is stored then redirect to login page
function requireLogin() {
    if (!sessionStorage.getItem("token")) window.location.href = "login.html";
}

// Get user name
function getUserName() {
    return sessionStorage.getItem("userName") || "";
}


// --- validation ---
function validateField(inputId, errorId, message) {
    // Get input and small error below it by their ids 
    var input = document.getElementById(inputId);
    var err = document.getElementById(errorId);
    
    // if input is empty then add red border (input error class) 
    if (!input.value || input.value.trim() === "") {
        input.classList.add("input-error");
        // set error message text 
        err.textContent = message;
        // show error
        err.classList.add("show");
        return false;
    }

    // if no error 
    input.classList.remove("input-error");
    err.classList.remove("show");
    return true;
}


// Same as the validate field but checks if a dropdown has a chosen value
function validateSelect(selectId, errorId, message) {
    var sel = document.getElementById(selectId);
    var err = document.getElementById(errorId);

    if (!sel.value) {
        sel.classList.add("input-error");
        err.textContent = message;
        err.classList.add("show");
        return false;
    }

    sel.classList.remove("input-error");
    err.classList.remove("show");
    return true;
}


// --- button state ---
// When loading is true: disables the button so the user can't double-click it, 
// saves the original button text into a data-label attribute, 
// then replaces the button content with a spinner icon and "Loading..." text. 
// When loading is false: re-enables the button and restores the original text from data-label.
function setLoading(btn, loading) {
    if (loading) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.innerHTML = '<span class="spinner"></span> Loading...';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.label || "Submit";
    }
}


// --- alerts and results ---
// Used on the login page for the colored message bar. 
// First clears any previous color class, then adds either the red or green class based on isError, 
// sets the message text, then adds show to make it visible (the CSS hides it by default with display: none).
//showResult works the same way but targets the result box that appears below operation buttons 
// it also looks inside the box for the .result-value element to set the text.

function showAlert(id, message, isError) {
    var el = document.getElementById(id);
    el.classList.remove("alert-success", "alert-error");
    el.classList.add(isError ? "alert-error" : "alert-success");
    el.textContent = message;
    el.classList.add("show");
}

function hideAlert(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("show");
}

function showResult(boxId, message, isError) {
    var box = document.getElementById(boxId);
    box.querySelector(".result-value").textContent = message;
    box.classList.remove("result-success", "result-error", "show");
    box.classList.add(isError ? "result-error" : "result-success");
    box.classList.add("show");
}


// --- dropdowns ---
// Clears a dropdown and rebuilds it with a new list. 
// First sets a default placeholder option, then loops through the array, 
// creates an <option> element for each item, and appends it.
function fillSelect(selectId, options) {
    var sel = document.getElementById(selectId);
    sel.innerHTML = '<option value="">-- Select --</option>';
    options.forEach(function(opt) {
        var o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        sel.appendChild(o);
    });
}

// Attaches a change event to a type dropdown. 
// When the user changes it, 
// this.value gives the selected type (e.g. "Weight"), 
// looks it up in UNITS, and refills the unit dropdown. || 
// [] is a fallback in case the value is blank.
function wireTypeToUnit(typeId, unitId) {
    document.getElementById(typeId).addEventListener("change", function() {
        fillSelect(unitId, UNITS[this.value] || []);
    });
}


// --- quantity helpers ---
// A shortcut that creates the quantity object the backend expects. 
// parseFloat converts the string from the input field into a decimal number.

function buildQty(value, unit, type) {
    return {
        value: parseFloat(value),
        unitName: unit,
        measurementType: type
    };
}

// Does the same job as buildQty but as a class. 
// The Compare section uses new Quantity(...).toDTO(). 
// The constructor runs when you write new Quantity(...) and 
// sets the properties. toDTO() returns a plain object version for sending as JSON.
class Quantity {
    constructor(value, unit, type) {
        this.value = parseFloat(value);
        this.unitName = unit;
        this.measurementType = type;
    }

    toDTO() {
        return {
            value: this.value,
            unitName: this.unitName,
            measurementType: this.measurementType
        };
    }
}


// --- password toggle ---
// Attaches a click listener to the show/hide button. 
// isHidden checks whether the input is currently a password field. 
// If it is, switch to type="text" to reveal it and 
// update the button label to "hide". Otherwise switch back to type="password" and show "show".
function initPasswordToggle(eyeBtnId, inputId) {
    document.getElementById(eyeBtnId).addEventListener("click", function() {
        var input = document.getElementById(inputId);
        var isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        this.textContent = isHidden ? "hide" : "show";
    });
}
