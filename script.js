/* =========================================================
   MALCERT - COMPLETE SCRIPT.JS
   DASHBOARD • PROFILE • SETTINGS • DARK MODE • COUNTDOWN
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GENERAL HELPER
    ===================================================== */

    const get = (id) => document.getElementById(id);


    /* =====================================================
       STUDENT INFORMATION
    ===================================================== */

    let studentName =
        localStorage.getItem("studentName") || "Student";

    let studentEmail =
        localStorage.getItem("studentEmail") || "";

    let studentClass =
        localStorage.getItem("studentClass") || "";


    /* =====================================================
       STUDENT INITIALS
    ===================================================== */

    function getInitials(name) {

        if (!name || !name.trim()) {
            return "ST";
        }

        const words = name.trim().split(/\s+/);

        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();

    }


    const initials = getInitials(studentName);


    /* =====================================================
       DISPLAY STUDENT NAME
    ===================================================== */

    document
        .querySelectorAll(
            "#userName, #welcomeName, #studentName, .student-name"
        )
        .forEach(function (element) {

            element.textContent = studentName;

        });


    /* =====================================================
       DISPLAY EMAIL
    ===================================================== */

    document
        .querySelectorAll(
            "#userEmail, .student-email"
        )
        .forEach(function (element) {

            element.textContent = studentEmail;

        });


    /* =====================================================
       DISPLAY CLASS
    ===================================================== */

    document
        .querySelectorAll(
            "#studentClass, .student-class"
        )
        .forEach(function (element) {

            if (studentClass) {
                element.textContent = studentClass;
            }

        });


    /* =====================================================
       DISPLAY INITIALS
    ===================================================== */

    document
        .querySelectorAll(
            "#userInitials, #avatar, .avatar, .student-avatar"
        )
        .forEach(function (element) {

            /*
             * Do not replace an actual profile image.
             */

            if (!element.querySelector("img")) {

                element.textContent = initials;

            }

        });


    /* =====================================================
       WELCOME MESSAGE
    ===================================================== */

    const welcomeTitle = get("welcomeTitle");

    if (welcomeTitle) {

        const hasWelcomed =
            sessionStorage.getItem(
                "malcertWelcomeShown"
            );

        if (hasWelcomed === "true") {

            welcomeTitle.textContent =
                "Welcome back, " +
                studentName +
                "!";

        } else {

            welcomeTitle.textContent =
                "Welcome, " +
                studentName +
                "!";

            sessionStorage.setItem(
                "malcertWelcomeShown",
                "true"
            );

        }

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    window.logout = function () {

        localStorage.removeItem("isLoggedIn");

        sessionStorage.removeItem(
            "malcertWelcomeShown"
        );

        /*
         * No login redirect because your
         * current MalCert version does not use it.
         */

        location.reload();

    };


    document
        .querySelectorAll(
            "#logoutBtn, .logout-btn, .logout-link"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );

        });


    /* =====================================================
       SUBJECT SEARCH
    ===================================================== */

    window.searchSubjects = function () {

        const searchInput =
            get("subjectSearch");

        if (!searchInput) return;

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        document
            .querySelectorAll(".subject-card")
            .forEach(function (card) {

                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    text.includes(search)
                        ? ""
                        : "none";

            });

    };


    /* =====================================================
       GENERAL DASHBOARD SEARCH
    ===================================================== */

    const dashboardSearch = get("search");

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .toLowerCase()
                        .trim();

                /*
                 * Search dashboard cards.
                 */

                document
                    .querySelectorAll(
                        ".subject-card, .upload-item, .card"
                    )
                    .forEach(function (item) {

                        const text =
                            item.textContent
                                .toLowerCase();

                        item.style.display =
                            text.includes(search)
                                ? ""
                                : "none";

                    });

            }
        );

    }


    /* =====================================================
       SONG SEARCH
       Kept for compatibility with other pages.
    ===================================================== */

    window.searchSong = function () {

        const input = get("songSearch");

        if (!input) return;

        const search =
            input.value
                .toLowerCase()
                .trim();

        document
            .querySelectorAll(
                ".song-card, .music-card"
            )
            .forEach(function (card) {

                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    text.includes(search)
                        ? ""
                        : "none";

            });

    };


    /* =====================================================
       PROFILE PICTURE
    ===================================================== */

    const profilePicture =
        get("profilePicture");

    if (profilePicture) {

        profilePicture.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) return;

                if (!file.type.startsWith("image/")) {

                    alert(
                        "Please select an image file."
                    );

                    profilePicture.value = "";

                    return;

                }

                const reader =
                    new FileReader();

                reader.onload =
                    function (e) {

                        const image =
                            document.querySelector(
                                ".profile-picture-preview img"
                            );

                        const placeholder =
                            document.querySelector(
                                ".profile-picture-placeholder"
                            );

                        if (image) {

                            image.src =
                                e.target.result;

                            image.style.display =
                                "block";

                        }

                        if (placeholder) {

                            placeholder.style.display =
                                "none";

                        }

                        localStorage.setItem(
                            "malcertProfilePicture",
                            e.target.result
                        );

                    };

                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       LOAD PROFILE PICTURE
    ===================================================== */

    const savedPicture =
        localStorage.getItem(
            "malcertProfilePicture"
        );

    if (savedPicture) {

        document
            .querySelectorAll(
                ".profile-picture-preview img"
            )
            .forEach(function (image) {

                image.src = savedPicture;

                image.style.display =
                    "block";

            });

        document
            .querySelectorAll(
                ".profile-picture-placeholder"
            )
            .forEach(function (placeholder) {

                placeholder.style.display =
                    "none";

            });

    }


    /* =====================================================
       SETTINGS - LOAD CURRENT INFORMATION
    ===================================================== */

    const settingsName =
        get("settingsName");

    const settingsEmail =
        get("settingsEmail");

    if (settingsName) {

        settingsName.value =
            studentName;

    }

    if (settingsEmail) {

        settingsEmail.value =
            studentEmail;

    }


    /* =====================================================
       SETTINGS - SAVE PROFILE
    ===================================================== */

    const saveProfileBtn =
        get("saveProfileBtn");

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            function () {

                const nameInput =
                    get("settingsName");

                const emailInput =
                    get("settingsEmail");

                let account = {};

                const accountData =
                    localStorage.getItem(
                        "malcertAccount"
                    );

                if (accountData) {

                    try {

                        account =
                            JSON.parse(accountData);

                    } catch (error) {

                        console.error(
                            "Unable to read account data:",
                            error
                        );

                        account = {};

                    }

                }


                /* SAVE NAME */

                if (nameInput) {

                    const newName =
                        nameInput.value.trim();

                    if (!newName) {

                        alert(
                            "Please enter your name."
                        );

                        return;

                    }

                    account.name =
                        newName;

                    localStorage.setItem(
                        "studentName",
                        newName
                    );

                }


                /* SAVE EMAIL */

                if (emailInput) {

                    const newEmail =
                        emailInput.value
                            .trim()
                            .toLowerCase();

                    if (newEmail) {

                        account.email =
                            newEmail;

                        localStorage.setItem(
                            "studentEmail",
                            newEmail
                        );

                    }

                }


                /* SAVE ACCOUNT */

                localStorage.setItem(
                    "malcertAccount",
                    JSON.stringify(account)
                );


                alert(
                    "Profile updated successfully."
                );

                location.reload();

            }
        );

    }


    /* =====================================================
       DARK MODE
    ===================================================== */

    const darkModeToggle =
        get("darkModeToggle");

    const savedDarkMode =
        localStorage.getItem(
            "malcertDarkMode"
        );


    /* LOAD DARK MODE */

    if (savedDarkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );

        if (darkModeToggle) {

            darkModeToggle.checked =
                true;

        }

    }


    /* TOGGLE DARK MODE */

    if (darkModeToggle) {

        darkModeToggle.addEventListener(
            "change",
            function () {

                if (this.checked) {

                    document.body.classList.add(
                        "dark-mode"
                    );

                    localStorage.setItem(
                        "malcertDarkMode",
                        "true"
                    );

                } else {

                    document.body.classList.remove(
                        "dark-mode"
                    );

                    localStorage.setItem(
                        "malcertDarkMode",
                        "false"
                    );

                }

            }
        );

    }


    /* =====================================================
       EXAM COUNTDOWN
    ===================================================== */

    /*
     * MSCE examination date:
     * 22 July 2027
     */

    const examDate =
        new Date(
            "July 22, 2027 00:00:00"
        );


    function updateExamCountdown() {

        const now =
            new Date();

        const difference =
            examDate - now;


        const daysElement =
            get("examDays");

        const hoursElement =
            get("examHours");

        const minutesElement =
            get("examMinutes");

        const secondsElement =
            get("examSeconds");


        /* EXAM HAS STARTED */

        if (difference <= 0) {

            if (daysElement)
                daysElement.textContent = "0";

            if (hoursElement)
                hoursElement.textContent = "00";

            if (minutesElement)
                minutesElement.textContent = "00";

            if (secondsElement)
                secondsElement.textContent = "00";

            return;

        }


        /* DAYS */

        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        /* HOURS */

        const hours =
            Math.floor(
                (
                    difference /
                    (1000 * 60 * 60)
                ) % 24
            );


        /* MINUTES */

        const minutes =
            Math.floor(
                (
                    difference /
                    (1000 * 60)
                ) % 60
            );


        /* SECONDS */

        const seconds =
            Math.floor(
                (
                    difference /
                    1000
                ) % 60
            );


        /* DISPLAY */

        if (daysElement) {

            daysElement.textContent =
                days;

        }

        if (hoursElement) {

            hoursElement.textContent =
                String(hours)
                    .padStart(2, "0");

        }

        if (minutesElement) {

            minutesElement.textContent =
                String(minutes)
                    .padStart(2, "0");

        }

        if (secondsElement) {

            secondsElement.textContent =
                String(seconds)
                    .padStart(2, "0");

        }

    }


    /* START COUNTDOWN */

    if (
        get("examDays") ||
        get("examHours") ||
        get("examMinutes") ||
        get("examSeconds")
    ) {

        updateExamCountdown();

        setInterval(
            updateExamCountdown,
            1000
        );

    }


    /* =====================================================
       EXAM MODAL
    ===================================================== */

    const examModal =
        document.querySelector(
            ".exam-modal"
        );

    const examButton =
        document.querySelector(
            ".exam-countdown-btn"
        );

    const closeExam =
        document.querySelector(
            ".close-exam"
        );


    /* OPEN */

    if (
        examButton &&
        examModal
    ) {

        examButton.addEventListener(
            "click",
            function () {

                examModal.classList.add(
                    "active"
                );

            }
        );

    }


    /* CLOSE */

    if (
        closeExam &&
        examModal
    ) {

        closeExam.addEventListener(
            "click",
            function () {

                examModal.classList.remove(
                    "active"
                );

            }
        );

    }


    /* CLOSE OUTSIDE */

    if (examModal) {

        examModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    examModal
                ) {

                    examModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       CONTINUE LEARNING
    ===================================================== */

    const continueLearning =
        get("continueLearning");

    if (continueLearning) {

        continueLearning.addEventListener(
            "click",
            function () {

                window.location.href =
                    "library.html";

            }
        );

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const notification =
        get("notification");

    if (notification) {

        notification.addEventListener(
            "click",
            function () {

                alert(
                    "You have 3 new notifications."
                );

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (examModal) {

                    examModal.classList.remove(
                        "active"
                    );

                }

            }

        }
    );

});