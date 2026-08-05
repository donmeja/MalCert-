/* =========================================
   MALCERT ADMIN
   FIREBASE-ADMIN.JS
   PART 1
========================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAki1YOGefjDTDgXJ4qzc0Nwz_FwUo6998",
  authDomain: "malcert.firebaseapp.com",
  projectId: "malcert",
  storageBucket: "malcert.firebasestorage.app",
  messagingSenderId: "995694915586",
  appId: "1:995694915586:web:a78562d0b11b80144d371b"
};

/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

/* =========================================
   ADMIN AUTHENTICATION
========================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    const adminRef = doc(db, "users", user.uid);

    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {

        alert("Account not found.");

        location.href = "login.html";

        return;

    }

    const admin = adminSnap.data();

    if (admin.role !== "admin") {

        alert("Access denied.");

        location.href = "index.html";

        return;

    }

    document.getElementById("adminName").textContent =
        admin.name;

    loadStatistics();

    loadUsers();

});

/* =========================================
   LOAD DASHBOARD STATISTICS
========================================= */

async function loadStatistics() {

    const snapshot = await getDocs(
        collection(db, "users")
    );

    let students = 0;
    let teachers = 0;
    let admins = 0;

    snapshot.forEach((document) => {

        const user = document.data();

        switch (user.role) {

            case "student":
                students++;
                break;

            case "teacher":
                teachers++;
                break;

            case "admin":
                admins++;
                break;

        }

    });

    document.getElementById("usersCount").textContent =
        snapshot.size;

    document.getElementById("studentsCount").textContent =
        students;

    document.getElementById("teachersCount").textContent =
        teachers;

}

/* =========================================
   LOAD USERS
========================================= */

async function loadUsers() {

    const table =
        document.getElementById("usersTable");

    table.innerHTML = "";

    const users =
        await getDocs(collection(db, "users"));

    users.forEach((document) => {

        const user = document.data();

        const row =
            document.createElement("tr");

        row.innerHTML = `

        <td>${user.name}</td>

        <td>${user.email}</td>

        <td>${user.role}</td>

        <td>

            ${user.approved ? "Approved" : "Pending"}

        </td>

        <td>

        <button
        class="approve-btn"

        data-id="${document.id}">

        Approve

        </button>

        <button
        class="delete-btn"

        data-id="${document.id}">

        Delete

        </button>

        </td>

        `;

        table.appendChild(row);

    });

    activateButtons();

}

/* =========================================
   BUTTON EVENTS
========================================= */

function activateButtons() {

    document
    .querySelectorAll(".approve-btn")
    .forEach(button => {

        button.onclick = async () => {

            const id =
            button.dataset.id;

            await updateDoc(

                doc(db, "users", id),

                {

                    approved: true

                }

            );

            loadUsers();

        };

    });

    document
    .querySelectorAll(".delete-btn")
    .forEach(button => {

        button.onclick = async () => {

            if (!confirm("Delete this user?"))
                return;

            const id =
            button.dataset.id;

            await deleteDoc(

                doc(db, "users", id)

            );

            loadStatistics();

            loadUsers();

        };

    });

}

/* =========================================
   LOGOUT
========================================= */

document
.getElementById("logoutBtn")
.onclick = async () => {

    await signOut(auth);

    location.href = "login.html";

};
/* =========================================
   PART 2A
   RESOURCE MANAGEMENT
========================================= */

import {
    ref,
    listAll,
    getMetadata,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* =========================================
   LOAD RESOURCES
========================================= */

async function loadResources(){

    const grid =
    document.getElementById("resourceGrid");

    if(!grid) return;

    grid.innerHTML = "";

    let totalFiles = 0;

    const subjects = [

        "Additional Mathematics",
        "Agriculture",
        "Bible Knowledge",
        "Biology",
        "Business Studies",
        "Chemistry",
        "Chichewa",
        "Computer Studies",
        "English",
        "Geography",
        "History",
        "Home Economics",
        "Life Skills",
        "Mathematics",
        "Physics",
        "Social Studies"

    ];

    const levels = [

        "Form 3",
        "Form 4",
        "Paper I",
        "Paper II",
        "Paper III"

    ];

    const categories = [

        "Books",
        "Notes",
        "Past Papers"

    ];

    for(const subject of subjects){

        for(const level of levels){

            for(const category of categories){

                try{

                    const folderRef = ref(
                        storage,
                        `uploads/${subject}/${level}/${category}`
                    );

                    const files =
                    await listAll(folderRef);

                    for(const file of files.items){

                        totalFiles++;

                        const meta =
                        await getMetadata(file);

                        const card =
                        document.createElement("div");

                        card.className =
                        "resource-card";

                        card.innerHTML = `

                        <h4>${file.name}</h4>

                        <small>

                        ${subject}

                        </small>

                        <br>

                        <small>

                        ${level}

                        </small>

                        <br>

                        <small>

                        ${category}

                        </small>

                        <br><br>

                        <small>

                        ${(meta.size/1024).toFixed(1)} KB

                        </small>

                        <button>

                        Delete Resource

                        </button>

                        `;

                        card.querySelector("button")
                        .onclick = async()=>{

                            const confirmDelete =
                            confirm(

                            "Delete this resource?"

                            );

                            if(!confirmDelete)
                            return;

                            try{

                                await deleteObject(file);

                                alert(

                                "Resource deleted."

                                );

                                loadResources();

                            }

                            catch(error){

                                alert(error.message);

                            }

                        };

                        grid.appendChild(card);

                    }

                }

                catch(error){

                    // Ignore empty folders

                }

            }

        }

    }

    document.getElementById(
        "filesCount"
    ).textContent = totalFiles;

}

/* =========================================
   AUTO LOAD
========================================= */

loadResources();
/* =========================================
   PART 2B
   SUBJECT MANAGEMENT
========================================= */

import {
    addDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* =========================================
   SUBJECT COLLECTION
========================================= */

const subjectsCollection = collection(db, "subjects");

/* =========================================
   LOAD SUBJECTS
========================================= */

async function loadSubjects(){

    let snapshot = await getDocs(subjectsCollection);

    let list = [];

    snapshot.forEach(docSnap=>{

        list.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

    return list;

}

/* =========================================
   ADD SUBJECT
========================================= */

document.getElementById("addSubject").onclick =
async()=>{

    let name = prompt("Enter subject name");

    if(!name) return;

    name = name.trim();

    if(name==="") return;

    try{

        await addDoc(subjectsCollection,{

            name:name,

            createdAt:serverTimestamp(),

            active:true

        });

        alert("Subject added successfully.");

    }

    catch(error){

        alert(error.message);

    }

};

/* =========================================
   EDIT SUBJECT
========================================= */

async function editSubject(id,currentName){

    const newName = prompt(

        "Edit subject",

        currentName

    );

    if(!newName) return;

    await setDoc(

        doc(db,"subjects",id),

        {

            name:newName,

            updatedAt:serverTimestamp(),

            active:true

        },

        {

            merge:true

        }

    );

    alert("Subject updated.");

}

/* =========================================
   DELETE SUBJECT
========================================= */

async function deleteSubject(id){

    if(

        !confirm(

        "Delete this subject?"

        )

    ) return;

    await deleteDoc(

        doc(db,"subjects",id)

    );

    alert("Subject removed.");

}

/* =========================================
   SUBJECT LIST
========================================= */

async function renderSubjects(){

    const activity =
    document.getElementById("activityList");

    if(!activity) return;

    activity.innerHTML="";

    const subjects =
    await loadSubjects();

    subjects.forEach(subject=>{

        const item =
        document.createElement("div");

        item.className =
        "activity-item";

        item.innerHTML=`

        <strong>

        ${subject.name}

        </strong>

        <br>

        <button
        class="editSubject">

        Edit

        </button>

        <button
        class="deleteSubject">

        Delete

        </button>

        `;

        item.querySelector(".editSubject")
        .onclick=()=>{

            editSubject(

                subject.id,

                subject.name

            );

        };

        item.querySelector(".deleteSubject")
        .onclick=()=>{

            deleteSubject(subject.id);

        };

        activity.appendChild(item);

    });

}

/* =========================================
   AUTO LOAD SUBJECTS
========================================= */

renderSubjects();
/* =========================================
   PART 2C
   REAL-TIME ACTIVITY
   SEARCH
   ANALYTICS
========================================= */

import {
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* =========================================
   LIVE USERS
========================================= */

const usersQuery = query(
    collection(db, "users")
);

onSnapshot(usersQuery, (snapshot) => {

    let total = 0;
    let teachers = 0;
    let students = 0;

    snapshot.forEach((docSnap) => {

        total++;

        const user = docSnap.data();

        if (user.role === "teacher")
            teachers++;

        if (user.role === "student")
            students++;

    });

    document.getElementById("usersCount").textContent = total;
    document.getElementById("teachersCount").textContent = teachers;
    document.getElementById("studentsCount").textContent = students;

});

/* =========================================
   LIVE SUBJECTS
========================================= */

onSnapshot(collection(db, "subjects"), () => {

    renderSubjects();

});

/* =========================================
   SEARCH USERS
========================================= */

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const keyword =
searchInput.value.toLowerCase();

document
.querySelectorAll("#usersTable tr")
.forEach(row=>{

const text =
row.textContent.toLowerCase();

row.style.display =
text.includes(keyword)
? ""
: "none";

});

});

}

/* =========================================
   RECENT ACTIVITY
========================================= */

const activityQuery = query(

collection(db,"activity"),

orderBy("createdAt","desc"),

limit(10)

);

onSnapshot(activityQuery,(snapshot)=>{

const list =
document.getElementById("activityList");

if(!list) return;

list.innerHTML="";

snapshot.forEach(docSnap=>{

const activity =
docSnap.data();

const item =
document.createElement("div");

item.className="activity-item";

item.innerHTML=`

<strong>

${activity.title}

</strong>

<p>

${activity.description}

</p>

<small>

${activity.user}

</small>

`;

list.appendChild(item);

});

});

/* =========================================
   SYSTEM HEALTH
========================================= */

function updateSystemHealth(){

const totalUsers =
Number(
document.getElementById("usersCount").textContent
);

const totalFiles =
Number(
document.getElementById("filesCount").textContent
);

let status="Excellent";

if(totalUsers<10)
status="Getting Started";

if(totalFiles===0)
status="No Resources";

console.log("System Status:",status);

}

setInterval(updateSystemHealth,30000);

/* =========================================
   AUTO REFRESH
========================================= */

setInterval(()=>{

loadResources();

renderSubjects();

},60000);

/* =========================================
   DASHBOARD READY
========================================= */

console.log("MalCert Admin Dashboard Loaded Successfully.");