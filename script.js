/* ==========================
   MALCERT DASHBOARD
   SCRIPT.JS
========================== */

// -------------------------
// Load Student Name
// -------------------------

const savedName = localStorage.getItem("studentName");

if (savedName) {
    document.getElementById("studentName").textContent = savedName;
    document.getElementById("welcomeName").textContent = savedName;

    const avatar = document.querySelector(".avatar");
    avatar.textContent = savedName.charAt(0).toUpperCase();
}

// -------------------------
// Search
// -------------------------

const search = document.getElementById("search");

search.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    document.querySelectorAll(".subject-card").forEach(card => {

        let subject = card.querySelector("h3").textContent.toLowerCase();

        if (subject.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});

// -------------------------
// Subject Buttons
// -------------------------

document.querySelectorAll(".subject-card button").forEach(button => {

    button.addEventListener("click", function () {

        let subject =
            this.parentElement.querySelector("h3").textContent;

        alert("Opening " + subject);

        // Future Firebase page
        // location.href = "subject.html?name=" + subject;

    });

});

// -------------------------
// Download Buttons
// -------------------------

document.querySelectorAll(".upload-item button").forEach(button => {

    button.addEventListener("click", function () {

        alert("This file will download once Firebase Storage is connected.");

    });

});

// -------------------------
// Continue Learning
// -------------------------

document.querySelector(".primary-btn").onclick = function () {

    document.querySelector(".subjects").scrollIntoView({

        behavior: "smooth"

    });

};

// -------------------------
// Exam Countdown
// -------------------------

const examDate = new Date("2026-11-01");

function updateCountdown() {

    const today = new Date();

    const difference = examDate - today;

    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    if (days > 0) {

        document.getElementById("daysLeft").textContent =
            days + " Days";

    } else {

        document.getElementById("daysLeft").textContent =
            "Exams Started";

    }

}

updateCountdown();

setInterval(updateCountdown, 3600000);

// -------------------------
// Notifications
// -------------------------

document.querySelector(".notification").onclick = function () {

    alert(
        "Notifications\n\n" +
        "• Biology Notes uploaded\n" +
        "• New Mathematics Paper\n" +
        "• MANEB announcement available"
    );

};

// -------------------------
// MANEB Notice
// -------------------------

document.querySelector(".notice-card button").onclick = function () {

    alert(
        "MANEB Registration closes next month."
    );

};

// -------------------------
// Logout
// -------------------------

document.getElementById("logoutBtn").onclick = function () {

    if (confirm("Logout from MalCert?")) {

        localStorage.removeItem("isLoggedIn");

        location.href = "login.html";

    }

};

// -------------------------
// Hover Animation
// -------------------------

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", function () {

        this.style.transform = "translateY(-8px)";

    });

    card.addEventListener("mouseleave", function () {

        this.style.transform = "translateY(0)";

    });

});

// -------------------------
// Welcome
// -------------------------

console.log("MalCert Dashboard Loaded Successfully");