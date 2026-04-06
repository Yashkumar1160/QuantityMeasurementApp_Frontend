//

// Finds all tab buttons and adds a click listener to each.
// When clicked: first strips active from every tab button and every panel (resetting all of them), 
// then adds active to the clicked button and its matching panel. 
// The panel ID is built by joining this.dataset.tab (either "login" or "register") 
// with "-panel". Then clears any alert boxes left over from a previous attempt.
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".tab-btn").forEach(function(t) { t.classList.remove("active"); });
            document.querySelectorAll(".tab-panel").forEach(function(p) { p.classList.remove("active"); });

            this.classList.add("active");
            document.getElementById(this.dataset.tab + "-panel").classList.add("active");

            hideAlert("login-alert");
            hideAlert("register-alert");
        });
    });
}


// Runs both validation checks. 
// If either returns false, 
// the function exits immediately and the errors are shown on screen
function handleLogin() {
    hideAlert("login-alert");

    var emailOk = validateField("login-email", "login-email-err", "Email is required");
    var passOk  = validateField("login-pass",  "login-pass-err",  "Password is required");
    if (!emailOk || !passOk) return;

    var btn  = document.getElementById("login-btn");

    // Builds the request body, sets the button to loading, 
    // then calls the API. On success it saves the session and redirects. 
    // On failure it stops the loading state and shows the error message. 
    // .trim() removes any accidental spaces around the email.
    var body = {
        email:    document.getElementById("login-email").value.trim(),
        password: document.getElementById("login-pass").value
    };

    setLoading(btn, true);

    apiCall("POST", "/auth/login", body)
        .then(function(data) {
            saveSession(data);
            window.location.href = "index.html";
        })
        .catch(function(err) {
            setLoading(btn, false);
            showAlert("login-alert", (err && err.message) ? err.message : "Login failed. Check your details.", true);
        });
}


// handleRegister follows the same pattern with an extra password length check before the API call.
function handleRegister() {
    hideAlert("register-alert");

    var nameOk  = validateField("reg-name",  "reg-name-err",  "Name is required");
    var emailOk = validateField("reg-email", "reg-email-err", "Email is required");
    var passOk  = validateField("reg-pass",  "reg-pass-err",  "Password is required");
    if (!nameOk || !emailOk || !passOk) return;

    var pass = document.getElementById("reg-pass").value;
    if (pass.length < 6) {
        var errEl = document.getElementById("reg-pass-err");
        errEl.textContent = "Password must be at least 6 characters";
        errEl.classList.add("show");
        return;
    }

    var btn  = document.getElementById("reg-btn");
    var body = {
        name:     document.getElementById("reg-name").value.trim(),
        email:    document.getElementById("reg-email").value.trim(),
        password: pass
    };

    setLoading(btn, true);

    apiCall("POST", "/auth/register", body)
        .then(function(data) {
            saveSession(data);
            window.location.href = "index.html";
        })
        .catch(function(err) {
            setLoading(btn, false);
            showAlert("register-alert", (err && err.message) ? err.message : "Registration failed. Email may already exist.", true);
        });
}


// This event fires after the browser has fully parsed the HTML. 
// Everything that touches the DOM (getting elements, attaching listeners) must go inside here 
// — otherwise the elements don't exist yet when the script runs.
document.addEventListener("DOMContentLoaded", function() {
    initTabs();

    if (document.getElementById("eye-login")) initPasswordToggle("eye-login", "login-pass");
    if (document.getElementById("eye-reg"))   initPasswordToggle("eye-reg",   "reg-pass");

    var loginBtn = document.getElementById("login-btn");
    var regBtn   = document.getElementById("reg-btn");

    if (loginBtn) loginBtn.addEventListener("click", handleLogin);
    if (regBtn)   regBtn.addEventListener("click", handleRegister);

    var loginPass = document.getElementById("login-pass");
    var regPass   = document.getElementById("reg-pass");

    if (loginPass) loginPass.addEventListener("keydown", function(e) { if (e.key === "Enter") handleLogin(); });
    if (regPass)   regPass.addEventListener("keydown",   function(e) { if (e.key === "Enter") handleRegister(); });
});
