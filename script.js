/* =========================================================
   MALCERT - COMPLETE SCRIPT.JS
   LOGIN • REGISTER • DASHBOARD • SETTINGS • COUNTDOWN
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GENERAL HELPERS
    ===================================================== */

    const get = (id) => document.getElementById(id);

    function showMessage(element, message, type = "error") {
        if (!element) return;

        element.textContent = message;
        element.className = "auth-message " + type;
        element.style.display = "block";
    }

    function hideMessage(element) {
        if (!element) return;

        element.textContent = "";
        element.style.display = "none";
        element.className = "auth-message";
    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    window.togglePassword = function (inputId, button) {

        const input = get(inputId);

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";

            if (button) {
                const icon = button.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }
            }

        } else {

            input.type = "password";

            if (button) {
                const icon = button.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        }
    };


    /* =====================================================
       REGISTER
    ===================================================== */

    const registerForm = get("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nameInput =
                get("registerName") ||
                get("studentName") ||
                get("name");

            const emailInput =
                get("registerEmail") ||
                get("email");

            const passwordInput =
                get("registerPassword") ||
                get("password");

            const confirmInput =
                get("confirmPassword") ||
                get("registerConfirmPassword");

            const classInput =
                get("studentClass") ||
                get("registerClass") ||
                get("class");

            const message =
                get("registerMessage") ||
                get("authMessage");

            const name =
                nameInput ? nameInput.value.trim() : "";

            const email =
                emailInput ? emailInput.value.trim().toLowerCase() : "";

            const password =
                passwordInput ? passwordInput.value : "";

            const confirmPassword =
                confirmInput ? confirmInput.value : "";

            const studentClass =
                classInput ? classInput.value : "";


            /* VALIDATION */

            if (!name) {
                showMessage(message, "Please enter your full name.");
                return;
            }

            if (!email) {
                showMessage(message, "Please enter your email address.");
                return;
            }

            if (!password) {
                showMessage(message, "Please create a password.");
                return;
            }

            if (password.length < 6) {
                showMessage(
                    message,
                    "Password must contain at least 6 characters."
                );
                return;
            }

            if (
                confirmInput &&
                password !== confirmPassword
            ) {
                showMessage(
                    message,
                    "Passwords do not match."
                );
                return;
            }


            /* CHECK EXISTING ACCOUNT */

            const existingAccount =
                localStorage.getItem("malcertAccount");

            if (existingAccount) {

                try {

                    const account =
                        JSON.parse(existingAccount);

                    if (
                        account.email &&
                        account.email.toLowerCase() === email
                    ) {

                        showMessage(
                            message,
                            "An account with this email already exists."
                        );

                        return;
                    }

                } catch (error) {

                    console.error(
                        "Account data error:",
                        error
                    );

                }
            }


            /* PROFILE PICTURE */

            const profilePicture =
                localStorage.getItem("malcertProfilePicture") || "";


            /* CREATE ACCOUNT */

            const account = {

                name: name,

                email: email,

                password: password,

                studentClass: studentClass,

                profilePicture: profilePicture,

                createdAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "malcertAccount",
                JSON.stringify(account)
            );


            /* SAVE COMMON VALUES */

            localStorage.setItem(
                "studentName",
                name
            );

            localStorage.setItem(
                "studentEmail",
                email
            );

            if (studentClass) {

                localStorage.setItem(
                    "studentClass",
                    studentClass
                );

            }


            /* SUCCESS */

            showMessage(
                message,
                "Account created successfully! Redirecting to login...",
                "success"
            );


            /* REDIRECT */

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1200);

        });
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const loginForm = get("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput =
                get("loginEmail");

            const passwordInput =
                get("loginPassword");

            const rememberInput =
                get("rememberMe");

            const message =
                get("loginMessage");


            const email =
                emailInput
                    ? emailInput.value.trim().toLowerCase()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            hideMessage(message);


            /* VALIDATION */

            if (!email || !password) {

                showMessage(
                    message,
                    "Please enter your email and password."
                );

                return;
            }


            /* GET ACCOUNT */

            const savedAccount =
                localStorage.getItem("malcertAccount");


            if (!savedAccount) {

                showMessage(
                    message,
                    "No account found. Please create an account first."
                );

                return;
            }


            let account;

            try {

                account =
                    JSON.parse(savedAccount);

            } catch (error) {

                console.error(
                    "Invalid account data:",
                    error
                );

                showMessage(
                    message,
                    "Your account data is damaged. Please register again."
                );

                return;
            }


            /* CHECK LOGIN */

            if (
                account.email.toLowerCase() !== email ||
                account.password !== password
            ) {

                showMessage(
                    message,
                    "Incorrect email or password."
                );

                return;
            }


            /* SAVE LOGIN */

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "studentName",
                account.name
            );

            localStorage.setItem(
                "studentEmail",
                account.email
            );

            localStorage.setItem(
                "studentClass",
                account.studentClass || ""
            );


            /* REMEMBER ME */

            if (
                rememberInput &&
                rememberInput.checked
            ) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "rememberMe"
                );

            }


            /* SUCCESS */

            showMessage(
                message,
                "Login successful! Opening your dashboard...",
                "success"
            );


            /* REDIRECT */

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 900);

        });
    }


    /* =====================================================
       PROTECT DASHBOARD
    ===================================================== */

    const isDashboard =
        document.querySelector(".dashboard");

    if (isDashboard) {

        const loggedIn =
            localStorage.getItem("isLoggedIn");

        if (loggedIn !== "true") {

            window.location.href =
                "login.html";

            return;
        }
    }


    /* =====================================================
       DISPLAY STUDENT INFORMATION
    ===================================================== */

    const studentName =
        localStorage.getItem("studentName") || "Student";

    const studentEmail =
        localStorage.getItem("studentEmail") || "";

    const studentClass =
        localStorage.getItem("studentClass") || "";


    /* NAME ELEMENTS */

    const nameElements =
        document.querySelectorAll(
            "#userName, #welcomeName, .student-name"
        );

    nameElements.forEach(function (element) {

        element.textContent =
            studentName;

    });


    /* EMAIL */

    const emailElements =
        document.querySelectorAll(
            "#userEmail, .student-email"
        );

    emailElements.forEach(function (element) {

        element.textContent =
            studentEmail;

    });


    /* CLASS */

    const classElements =
        document.querySelectorAll(
            "#studentClass, .student-class"
        );

    classElements.forEach(function (element) {

        if (studentClass) {
            element.textContent =
                studentClass;
        }

    });


    /* =====================================================
       STUDENT INITIALS
    ===================================================== */

    function getInitials(name) {

        if (!name) return "ST";

        const words =
            name.trim().split(/\s+/);

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


    const initials =
        getInitials(studentName);


    document
        .querySelectorAll(
            "#userInitials, .avatar, .student-avatar"
        )
        .forEach(function (element) {

            if (
                !element.querySelector("img")
            ) {

                element.textContent =
                    initials;

            }

        });


    /* =====================================================
       WELCOME MESSAGE
    ===================================================== */

    const welcomeTitle =
        get("welcomeTitle");

    if (welcomeTitle) {

        const hasWelcomed =
            sessionStorage.getItem(
                "malcertWelcomeShown"
            );

        if (hasWelcomed === "true") {

            welcomeTitle.textContent =
                "Welcome back, " + studentName + "!";

        } else {

            welcomeTitle.textContent =
                "Welcome, " + studentName + "!";

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

        localStorage.removeItem(
            "isLoggedIn"
        );

        sessionStorage.removeItem(
            "malcertWelcomeShown"
        );

        window.location.href =
            "login.html";
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
       MOBILE MENU
    ===================================================== */

    const menuBtn =
        get("menuBtn");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const closeMenuBtn =
        document.querySelector(".close-menu-btn");


    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener(
            "click",
            function () {

                mobileMenu.classList.add("show");

            }
        );

    }


    if (closeMenuBtn && mobileMenu) {

        closeMenuBtn.addEventListener(
            "click",
            function () {

                mobileMenu.classList.remove("show");

            }
        );

    }


    /* CLOSE MOBILE MENU WHEN LINK IS CLICKED */

    document
        .querySelectorAll(
            ".mobile-nav-link, .mobile-feature-link"
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (mobileMenu) {

                        mobileMenu.classList.remove(
                            "show"
                        );

                    }

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
       GENERIC SONG SEARCH
       FOR OTHER MALCERT/MALAWAVE PAGES
    ===================================================== */

    window.searchSong = function () {

        const input =
            get("songSearch");

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
       FORGOT PASSWORD
    ===================================================== */

    window.forgotPassword = function (event) {

        if (event) {
            event.preventDefault();
        }

        const account =
            localStorage.getItem(
                "malcertAccount"
            );

        if (!account) {

            alert(
                "No MalCert account was found. Please create an account first."
            );

            return;
        }


        let savedAccount;

        try {

            savedAccount =
                JSON.parse(account);

        } catch (error) {

            alert(
                "Unable to read your account information."
            );

            return;
        }


        alert(
            "Password reset will be connected to Firebase Authentication later."
        );
    };


    /* =====================================================
       PROFILE PICTURE PREVIEW
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

                image.src =
                    savedPicture;

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

                const accountData =
                    localStorage.getItem(
                        "malcertAccount"
                    );

                if (!accountData) return;


                let account;

                try {

                    account =
                        JSON.parse(accountData);

                } catch (error) {

                    return;
                }


                if (nameInput) {

                    account.name =
                        nameInput.value.trim();

                    localStorage.setItem(
                        "studentName",
                        account.name
                    );

                }


                if (emailInput) {

                    account.email =
                        emailInput.value
                            .trim()
                            .toLowerCase();

                    localStorage.setItem(
                        "studentEmail",
                        account.email
                    );

                }


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


    if (savedDarkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );

        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }


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

    const examDate =
        new Date("July 22, 2027 00:00:00");


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


        if (difference <= 0) {

            if (daysElement)
                daysElement.textContent = "0";

            if (hoursElement)
                hoursElement.textContent = "0";

            if (minutesElement)
                minutesElement.textContent = "0";

            if (secondsElement)
                secondsElement.textContent = "0";

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (difference /
                    (1000 * 60 * 60)) % 24
            );

        const minutes =
            Math.floor(
                (difference /
                    (1000 * 60)) % 60
            );

        const seconds =
            Math.floor(
                (difference /
                    1000) % 60
            );


        if (daysElement)
            daysElement.textContent = days;

        if (hoursElement)
            hoursElement.textContent =
                String(hours).padStart(2, "0");

        if (minutesElement)
            minutesElement.textContent =
                String(minutes).padStart(2, "0");

        if (secondsElement)
            secondsElement.textContent =
                String(seconds).padStart(2, "0");
    }


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
        document.querySelector(".exam-modal");

    const examButton =
        document.querySelector(".exam-countdown-btn");

    const closeExam =
        document.querySelector(".close-exam");


    if (examButton && examModal) {

        examButton.addEventListener(
            "click",
            function () {

                examModal.classList.add(
                    "active"
                );

            }
        );
    }


    if (closeExam && examModal) {

        closeExam.addEventListener(
            "click",
            function () {

                examModal.classList.remove(
                    "active"
                );

            }
        );
    }


    if (examModal) {

        examModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === examModal
                ) {

                    examModal.classList.remove(
                        "active"
                    );

                }

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

                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        "show"
                    );

                }

            }

        }
    );


    /* =====================================================
       PREVENT DASHBOARD FLASH
       REDIRECT UNAUTHENTICATED USERS
    ===================================================== */

    const protectedPages = [
        "dashboard.html",
        "subjects.html",
        "library.html",
        "study-notes.html",
        "past-papers.html",
        "settings.html"
    ];


    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        protectedPages.includes(currentPage) &&
        localStorage.getItem("isLoggedIn") !== "true"
    ) {

        window.location.href =
            "login.html";
    }

});