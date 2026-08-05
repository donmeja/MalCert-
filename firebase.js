/* ==========================
   MALCERT
   FIREBASE.JS
========================== */

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    getStorage,
    ref,
    listAll,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* ==========================
   YOUR FIREBASE CONFIG
========================== */

const firebaseConfig = {
  apiKey: "AIzaSyAki1YOGefjDTDgXJ4qzc0Nwz_FwUo6998",
  authDomain: "malcert.firebaseapp.com",
  projectId: "malcert",
  storageBucket: "malcert.firebasestorage.app",
  messagingSenderId: "995694915586",
  appId: "1:995694915586:web:a78562d0b11b80144d371b"
};

/* ==========================
   INITIALIZE
========================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

/* ==========================
   AUTH CHECK
========================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    try{

        const snap = await getDoc(doc(db,"users",user.uid));

        if(snap.exists()){

            const data = snap.data();

            document.getElementById("studentName").textContent =
            data.name;

            document.getElementById("welcomeName").textContent =
            data.name;

            document.querySelector(".avatar").textContent =
            data.name.charAt(0).toUpperCase();

        }

    }catch(e){

        console.log(e);

    }

});

/* ==========================
   LOAD LATEST FILES
========================== */

async function loadUploads(){

    const uploads=document.querySelector(".uploads");

    if(!uploads) return;

    uploads.innerHTML="";

    try{

        const list=await listAll(ref(storage,"uploads"));

        const files=list.items.slice(0,5);

        for(const file of files){

            const url=await getDownloadURL(file);

            const item=document.createElement("div");

            item.className="upload-item";

            item.innerHTML=`

                <div>

                    <h4>${file.name}</h4>

                    <small>Firebase Storage</small>

                </div>

                <button>Download</button>

            `;

            item.querySelector("button").onclick=function(){

                window.open(url,"_blank");

            };

            uploads.appendChild(item);

        }

    }catch(error){

        console.log(error);

    }

}

loadUploads();

/* ==========================
   LOAD SUBJECTS
========================== */

async function loadSubjects(){

    const container=document.querySelector(".subjects");

    if(!container) return;

    try{

        const q=query(

            collection(db,"subjects"),

            orderBy("name"),

            limit(20)

        );

        const snapshot=await getDocs(q);

        if(snapshot.empty) return;

        container.innerHTML="";

        snapshot.forEach(docItem=>{

            const subject=docItem.data();

            const card=document.createElement("div");

            card.className="subject-card";

            card.innerHTML=`

                <h3>${subject.name}</h3>

                <p>${subject.resources || 0} Resources</p>

                <button>Open</button>

            `;

            card.querySelector("button").onclick=function(){

                location.href=
                "subject.html?id="+docItem.id;

            };

            container.appendChild(card);

        });

    }catch(error){

        console.log(error);

    }

}

loadSubjects();

/* ==========================
   LOGOUT
========================== */

const logout=document.getElementById("logoutBtn");

if(logout){

    logout.onclick=async()=>{

        if(confirm("Logout?")){

            await signOut(auth);

            location.href="login.html";

        }

    };

}