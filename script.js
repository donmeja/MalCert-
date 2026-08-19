/* =========================================================
   MALCERT - SCRIPT.JS
   SUPABASE • PROFILE • SETTINGS • DARK MODE
   COUNTDOWN • SEARCH • MATERIALS
========================================================= */


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://qdodtmmomcyvvudqstbk.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_T5YgDR9MXGwi0SBawKpI2A_pMv-ytMb";


/* =====================================================
   INITIALIZE SUPABASE
===================================================== */

const supabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   SUPABASE MATERIALS
===================================================== */

/*
 * Get all materials.
 */

async function getMaterials() {

    const { data, error } =
        await supabase
            .from("materials")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Supabase materials error:",
            error
        );

        return [];

    }


    return data || [];

}


/* =====================================================
   GET BOOKS
===================================================== */

async function getBooks() {

    const { data, error } =
        await supabase
            .from("materials")
            .select("*")
            .eq("type", "Book")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Unable to load books:",
            error
        );

        return [];

    }


    return data || [];

}


/* =====================================================
   GET STUDY NOTES
===================================================== */

async function getStudyNotes() {

    const { data, error } =
        await supabase
            .from("materials")
            .select("*")
            .eq("type", "Notes")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Unable to load study notes:",
            error
        );

        return [];

    }


    return data || [];

}


/* =====================================================
   GET PAST PAPERS
===================================================== */

async function getPastPapers() {

    const { data, error } =
        await supabase
            .from("materials")
            .select("*")
            .eq("type", "Past Paper")
            .order("year", {
                ascending: false
            });


    if (error) {

        console.error(
            "Unable to load past papers:",
            error
        );

        return [];

    }


    return data || [];

}


/* =====================================================
   GET MATERIAL BY ID
===================================================== */

async function getMaterialById(id) {

    if (!id) {

        return null;

    }


    const { data, error } =
        await supabase
            .from("materials")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(
            "Unable to load material:",
            error
        );

        return null;

    }


    return data;

}


/* =====================================================
   GET PUBLIC PDF URL
===================================================== */

/*
 * file_path should contain the path of the
 * file inside the "malcert" Supabase bucket.
 */

function getPDFUrl(filePath) {

    if (!filePath) {

        return "";

    }


    const { data } =
        supabase
            .storage
            .from("malcert")
            .getPublicUrl(filePath);


    return data.publicUrl;

}


/* =====================================================
   GET STORAGE FILE URL
===================================================== */

function getStorageUrl(filePath) {

    return getPDFUrl(filePath);

}


/* =====================================================
   TEST SUPABASE CONNECTION
===================================================== */

async function testSupabase() {

    try {

        const { data, error } =
            await supabase
                .from("materials")
                .select(
                    "id,title,type,file_path"
                )
                .limit(5);


        if (error) {

            console.error(
                "Supabase connection failed:",
                error
            );

            return false;

        }


        console.log(
            "MalCert Supabase connected successfully."
        );


        console.table(
            data || []
        );


        return true;

    }

    catch (error) {

        console.error(
            "Supabase error:",
            error
        );

        return false;

    }

}


/* =====================================================
   GET MATERIAL COUNTS
===================================================== */

async function getMaterialCounts() {

    const materials =
        await getMaterials();


    const books =
        materials.filter(
            item =>
                String(item.type || "")
                    .toLowerCase() === "book"
        );


    const notes =
        materials.filter(
            item =>
                String(item.type || "")
                    .toLowerCase() === "notes"
        );


    const pastPapers =
        materials.filter(
            item =>
                String(item.type || "")
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    === "past paper"
        );


    return {

        total:
            materials.length,

        books:
            books.length,

        notes:
            notes.length,

        pastPapers:
            pastPapers.length

    };

}


/* =====================================================
   UPDATE DASHBOARD COUNTS
===================================================== */

async function updateDashboardCounts() {

    const pastPapersElement =
        document.getElementById(
            "pastPapersCount"
        );


    const notesElement =
        document.getElementById(
            "studyNotesCount"
        );


    const booksElement =
        document.getElementById(
            "booksCount"
        );


    /*
     * Only run this function if
     * dashboard count elements exist.
     */

    if (
        !pastPapersElement &&
        !notesElement &&
        !booksElement
    ) {

        return;

    }


    const counts =
        await getMaterialCounts();


    if (pastPapersElement) {

        pastPapersElement.textContent =
            counts.pastPapers;

    }


    if (notesElement) {

        notesElement.textContent =
            counts.notes;

    }


    if (booksElement) {

        booksElement.textContent =
            counts.books;

    }

}


/* =====================================================
   STUDENT INFORMATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           HELPER
        ================================================= */

        const get =
            (id) =>
                document.getElementById(id);


        /* =================================================
           STUDENT DATA
        ================================================= */

        let studentName =
            localStorage.getItem(
                "studentName"
            ) || "Student";


        let studentEmail =
            localStorage.getItem(
                "studentEmail"
            ) || "";


        let studentClass =
            localStorage.getItem(
                "studentClass"
            ) || "";


        /* =================================================
           GET INITIALS
        ================================================= */

        function getInitials(name) {

            if (
                !name ||
                !name.trim()
            ) {

                return "ST";

            }


            const words =
                name
                    .trim()
                    .split(/\s+/);


            if (
                words.length === 1
            ) {

                return words[0]
                    .substring(0, 2)
                    .toUpperCase();

            }


            return (
                words[0].charAt(0) +
                words[
                    words.length - 1
                ].charAt(0)
            ).toUpperCase();

        }


        const initials =
            getInitials(
                studentName
            );


        /* =================================================
           DISPLAY STUDENT NAME
        ================================================= */

        document
            .querySelectorAll(
                "#userName, #welcomeName, #studentName, .student-name"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        studentName;

                }
            );


        /* =================================================
           DISPLAY EMAIL
        ================================================= */

        document
            .querySelectorAll(
                "#userEmail, .student-email"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        studentEmail;

                }
            );


        /* =================================================
           DISPLAY CLASS
        ================================================= */

        document
            .querySelectorAll(
                "#studentClass, .student-class"
            )
            .forEach(
                function (element) {

                    if (studentClass) {

                        element.textContent =
                            studentClass;

                    }

                }
            );


        /* =================================================
           DISPLAY AVATAR
        ================================================= */

        document
            .querySelectorAll(
                "#userInitials, #avatar, .avatar, .student-avatar"
            )
            .forEach(
                function (element) {

                    if (
                        !element.querySelector(
                            "img"
                        )
                    ) {

                        element.textContent =
                            initials;

                    }

                }
            );


        /* =================================================
           WELCOME MESSAGE
        ================================================= */

        const welcomeTitle =
            get("welcomeTitle");


        if (welcomeTitle) {

            const hasWelcomed =
                sessionStorage.getItem(
                    "malcertWelcomeShown"
                );


            if (
                hasWelcomed === "true"
            ) {

                welcomeTitle.textContent =
                    "Welcome back, " +
                    studentName +
                    "!";

            }

            else {

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


        /* =================================================
           LOGOUT
        ================================================= */

        window.logout =
            function () {


                /*
                 * Clear local login state.
                 */

                localStorage.removeItem(
                    "isLoggedIn"
                );


                sessionStorage.removeItem(
                    "malcertWelcomeShown"
                );


                /*
                 * If using Supabase Auth,
                 * also sign the user out.
                 */

                if (
                    window.supabase &&
                    supabase.auth
                ) {

                    supabase.auth
                        .signOut()
                        .finally(
                            function () {

                                location.reload();

                            }
                        );

                }

                else {

                    location.reload();

                }

            };


        document
            .querySelectorAll(
                "#logoutBtn, .logout-btn, .logout-link"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            logout();

                        }
                    );

                }
            );


        /* =================================================
           DASHBOARD SEARCH
        ================================================= */

        const dashboardSearch =
            get("search");


        if (dashboardSearch) {

            dashboardSearch.addEventListener(
                "input",
                function () {

                    const search =
                        this.value
                            .toLowerCase()
                            .trim();


                    document
                        .querySelectorAll(
                            ".subject-card, .upload-item, .card"
                        )
                        .forEach(
                            function (item) {

                                const text =
                                    item.textContent
                                        .toLowerCase();


                                item.style.display =
                                    text.includes(
                                        search
                                    )
                                        ? ""
                                        : "none";

                            }
                        );

                }
            );

        }


        /* =================================================
           SUBJECT SEARCH
        ================================================= */

        window.searchSubjects =
            function () {

                const input =
                    get("subjectSearch");


                if (!input) {

                    return;

                }


                const search =
                    input.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        ".subject-card"
                    )
                    .forEach(
                        function (card) {

                            const text =
                                card.textContent
                                    .toLowerCase();


                            card.style.display =
                                text.includes(
                                    search
                                )
                                    ? ""
                                    : "none";

                        }
                    );

            };


        /* =================================================
           DARK MODE
        ================================================= */

        const darkModeToggle =
            get("darkModeToggle");


        const savedDarkMode =
            localStorage.getItem(
                "malcertDarkMode"
            );


        if (
            savedDarkMode === "true"
        ) {

            document.body.classList.add(
                "dark-mode"
            );


            if (darkModeToggle) {

                darkModeToggle.checked =
                    true;

            }

        }


        if (darkModeToggle) {

            darkModeToggle.addEventListener(
                "change",
                function () {

                    document.body.classList.toggle(
                        "dark-mode",
                        this.checked
                    );


                    localStorage.setItem(
                        "malcertDarkMode",
                        this.checked
                            ? "true"
                            : "false"
                    );

                }
            );

        }


        /* =================================================
           CONTINUE LEARNING
        ================================================= */

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


        /* =================================================
           NOTIFICATION
        ================================================= */

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


        /* =================================================
           PROFILE PICTURE
        ================================================= */

        const profilePicture =
            get("profilePicture");


        if (profilePicture) {

            profilePicture.addEventListener(
                "change",
                function (event) {

                    const file =
                        event.target.files[0];


                    if (!file) {

                        return;

                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Please select an image file."
                        );


                        profilePicture.value =
                            "";


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


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }


        /* =================================================
           LOAD PROFILE PICTURE
        ================================================= */

        const savedPicture =
            localStorage.getItem(
                "malcertProfilePicture"
            );


        if (savedPicture) {

            document
                .querySelectorAll(
                    ".profile-picture-preview img"
                )
                .forEach(
                    function (image) {

                        image.src =
                            savedPicture;


                        image.style.display =
                            "block";

                    }
                );


            document
                .querySelectorAll(
                    ".profile-picture-placeholder"
                )
                .forEach(
                    function (placeholder) {

                        placeholder.style.display =
                            "none";

                    }
                );

        }


        /* =================================================
           SETTINGS
        ================================================= */

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


        /* =================================================
           SAVE PROFILE
        ================================================= */

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


                    /* ================================
                       NAME
                    ================================= */

                    if (nameInput) {

                        const newName =
                            nameInput.value
                                .trim();


                        if (!newName) {

                            alert(
                                "Please enter your name."
                            );


                            return;

                        }


                        studentName =
                            newName;


                        localStorage.setItem(
                            "studentName",
                            newName
                        );

                    }


                    /* ================================
                       EMAIL
                    ================================= */

                    if (emailInput) {

                        const newEmail =
                            emailInput.value
                                .trim()
                                .toLowerCase();


                        studentEmail =
                            newEmail;


                        localStorage.setItem(
                            "studentEmail",
                            newEmail
                        );

                    }


                    alert(
                        "Profile updated successfully."
                    );


                    location.reload();

                }
            );

        }


        /* =================================================
           EXAM COUNTDOWN
        ================================================= */

        const examDate =
            new Date(
                "July 22, 2027 00:00:00"
            );


        function updateExamCountdown() {

            const difference =
                examDate - new Date();


            const daysElement =
                get("examDays");


            const hoursElement =
                get("examHours");


            const minutesElement =
                get("examMinutes");


            const secondsElement =
                get("examSeconds");


            if (
                difference <= 0
            ) {

                if (daysElement)
                    daysElement.textContent =
                        "0";


                if (hoursElement)
                    hoursElement.textContent =
                        "00";


                if (minutesElement)
                    minutesElement.textContent =
                        "00";


                if (secondsElement)
                    secondsElement.textContent =
                        "00";


                return;

            }


            const days =
                Math.floor(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            const hours =
                Math.floor(
                    (
                        difference /
                        (1000 * 60 * 60)
                    ) % 24
                );


            const minutes =
                Math.floor(
                    (
                        difference /
                        (1000 * 60)
                    ) % 60
                );


            const seconds =
                Math.floor(
                    (
                        difference /
                        1000
                    ) % 60
                );


            if (daysElement)
                daysElement.textContent =
                    days;


            if (hoursElement)
                hoursElement.textContent =
                    String(hours)
                        .padStart(2, "0");


            if (minutesElement)
                minutesElement.textContent =
                    String(minutes)
                        .padStart(2, "0");


            if (secondsElement)
                secondsElement.textContent =
                    String(seconds)
                        .padStart(2, "0");

        }


        /* =================================================
           START COUNTDOWN
        ================================================= */

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


        /* =================================================
           UPDATE DASHBOARD COUNTS
        ================================================= */

        updateDashboardCounts();


    }
);


/* =====================================================
   START SUPABASE CONNECTION TEST
===================================================== */

testSupabase();