/* ==========================
   ADMIN DASHBOARD.JS
========================== */

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
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* ==========================
   FIREBASE CONFIG
========================== */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

/* ==========================
   ADMIN AUTH
========================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    const adminDoc = await getDoc(doc(db,"users",user.uid));

    if(!adminDoc.exists()){

        alert("User not found.");

        location.href="login.html";

        return;

    }

    const admin = adminDoc.data();

    if(admin.role!=="admin"){

        alert("Access Denied.");

        location.href="index.html";

        return;

    }

    document.getElementById("adminName").textContent=admin.name;

    loadDashboard();

});

/* ==========================
   LOAD DASHBOARD
========================== */

async function loadDashboard(){

    const usersSnapshot=await getDocs(collection(db,"users"));

    let teachers=0;
    let students=0;

    const tbody=document.getElementById("usersBody");

    tbody.innerHTML="";

    usersSnapshot.forEach(document=>{

        const user=document.data();

        if(user.role==="teacher") teachers++;

        if(user.role==="student") students++;

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>${user.name}</td>

        <td>${user.email}</td>

        <td>${user.role}</td>

        <td>${user.approved?"Approved":"Pending"}</td>

        <td>

        ${
        user.role==="teacher" && !user.approved

        ?

        `<button class="approve"
        data-id="${document.id}">

        Approve

        </button>`

        :

        "-"

        }

        </td>

        `;

        tbody.appendChild(row);

    });

    document.getElementById("totalUsers").textContent=
    usersSnapshot.size;

    document.getElementById("totalTeachers").textContent=
    teachers;

    document.getElementById("totalStudents").textContent=
    students;

    document.getElementById("totalFiles").textContent=
    "Loading...";

    activateApprovalButtons();

}

/* ==========================
   APPROVE TEACHERS
========================== */

function activateApprovalButtons(){

    document.querySelectorAll(".approve")
    .forEach(button=>{

        button.onclick=async()=>{

            const id=button.dataset.id;

            await updateDoc(doc(db,"users",id),{

                approved:true

            });

            alert("Teacher Approved.");

            loadDashboard();

        };

    });

}

/* ==========================
   LOGOUT
========================== */

document.getElementById("logoutBtn").onclick=async()=>{

    if(confirm("Logout?")){

        await signOut(auth);

        location.href="login.html";

    }

};
/* ==========================
   ADMIN DASHBOARD
   PART 2
   File Management
========================== */

import {
    getStorage,
    ref,
    listAll,
    deleteObject,
    getMetadata
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const storage = getStorage(app);

/* ==========================
   LOAD FILES
========================== */

async function loadFiles(){

    const uploads =
    document.getElementById("recentUploads");

    uploads.innerHTML = "";

    let totalFiles = 0;

    const subjects = [

        "Mathematics",
        "English",
        "Biology",
        "Chemistry",
        "Physics",
        "Geography",
        "History",
        "Chichewa",
        "Agriculture",
        "Computer Studies"

    ];

    const folders = [

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

        for(const folder of folders){

            for(const category of categories){

                try{

                    const result = await listAll(

                        ref(
                            storage,
                            `uploads/${subject}/${folder}/${category}`
                        )

                    );

                    totalFiles += result.items.length;

                    for(const file of result.items){

                        const meta =
                        await getMetadata(file);

                        const card =
                        document.createElement("div");

                        card.className =
                        "upload-item";

                        card.innerHTML = `

                        <div>

                        <h4>${file.name}</h4>

                        <small>

                        ${subject} /
                        ${folder} /
                        ${category}

                        </small>

                        </div>

                        <button
                        class="deleteFile">

                        Delete

                        </button>

                        `;

                        card.querySelector(
                            ".deleteFile"
                        ).onclick = async()=>{

                            if(

                                confirm(

                                "Delete this file?"

                                )

                            ){

                                await deleteObject(file);

                                loadFiles();

                            }

                        };

                        uploads.appendChild(card);

                    }

                }

                catch(error){

                    console.log(error);

                }

            }

        }

    }

    document.getElementById(
        "totalFiles"
    ).textContent = totalFiles;

}

loadFiles();

/* ==========================
   SEARCH USERS
========================== */

const searchBox =
document.createElement("input");

searchBox.placeholder =
"Search users...";

searchBox.style.width = "100%";

searchBox.style.padding = "12px";

searchBox.style.margin =
"20px 0";

document.getElementById(
"usersTable"
).prepend(searchBox);

searchBox.onkeyup = function(){

    const value =
    this.value.toLowerCase();

    document.querySelectorAll(
        "#usersBody tr"
    ).forEach(row=>{

        row.style.display =

        row.textContent
        .toLowerCase()
        .includes(value)

        ?

        ""

        :

        "none";

    });

};

/* ==========================
   REFRESH
========================== */

setInterval(()=>{

    loadDashboard();

    loadFiles();

},60000);
/* ==========================
   ADMIN DASHBOARD
   PART 3
   User & Subject Management
========================== */

import {
    deleteDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* ==========================
   CHANGE USER ROLE
========================== */

async function changeUserRole(userId, role){

    try{

        await updateDoc(doc(db,"users",userId),{

            role:role

        });

        alert("Role updated successfully.");

        loadDashboard();

    }

    catch(error){

        alert(error.message);

    }

}

/* ==========================
   DELETE USER
========================== */

async function deleteUser(userId){

    if(!confirm("Delete this user?")) return;

    try{

        await deleteDoc(doc(db,"users",userId));

        alert("User deleted.");

        loadDashboard();

    }

    catch(error){

        alert(error.message);

    }

}

/* ==========================
   ADD ACTION BUTTONS
========================== */

function enableUserActions(){

    document.querySelectorAll("#usersBody tr").forEach(row=>{

        if(row.querySelector(".actions")) return;

        const role=row.children[2].textContent;

        const action=row.children[4];

        action.innerHTML="";

        const container=document.createElement("div");

        container.className="actions";

        if(role!=="admin"){

            const promote=document.createElement("button");

            promote.textContent="Make Admin";

            promote.onclick=()=>{

                const id=action.dataset.id;

                changeUserRole(id,"admin");

            };

            container.appendChild(promote);

        }

        const remove=document.createElement("button");

        remove.textContent="Delete";

        remove.style.background="#dc2626";

        remove.onclick=()=>{

            const id=action.dataset.id;

            deleteUser(id);

        };

        container.appendChild(remove);

        action.appendChild(container);

    });

}

/* ==========================
   SUBJECT MANAGEMENT
========================== */

async function addSubject(){

    const name=prompt("Subject name:");

    if(!name) return;

    try{

        await addDoc(collection(db,"subjects"),{

            name:name,

            resources:0,

            createdAt:new Date()

        });

        alert("Subject added.");

    }

    catch(error){

        alert(error.message);

    }

}

const subjectButton=document.createElement("button");

subjectButton.textContent="Add Subject";

subjectButton.style.marginBottom="20px";

subjectButton.onclick=addSubject;

const subjectsSection=document.querySelectorAll("section")[2];

subjectsSection.prepend(subjectButton);

/* ==========================
   DASHBOARD ANALYTICS
========================== */

function createAnalytics(){

    const stats=document.querySelector(".stats");

    const card=document.createElement("div");

    card.className="card";

    card.innerHTML=`

    <i class="fas fa-chart-column"></i>

    <h2 id="systemStatus">

    Online

    </h2>

    <p>System Status</p>

    `;

    stats.appendChild(card);

}

createAnalytics();

/* ==========================
   AUTO ENABLE BUTTONS
========================== */

setTimeout(enableUserActions,1500);