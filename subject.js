/* ==========================
   SUBJECT.JS
========================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getStorage,
    ref,
    listAll,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* ==========================
   FIREBASE CONFIG
========================== */

const firebaseConfig = {
  apiKey: "AIzaSyAki1YOGefjDTDgXJ4qzc0Nwz_FwUo6998",
  authDomain: "malcert.firebaseapp.com",
  projectId: "malcert",
  storageBucket: "malcert.firebasestorage.app",
  messagingSenderId: "995694915586",
  appId: "1:995694915586:web:a78562d0b11b80144d371b"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

/* ==========================
   GET SUBJECT
========================== */

const params = new URLSearchParams(window.location.search);

const subject = params.get("id") || "Mathematics";

document.getElementById("subjectTitle").textContent = subject;

document.getElementById("subjectHeading").textContent = subject;

/* ==========================
   SHOW FORM/PAPER OPTIONS
========================== */

const level = document.getElementById("level");

if(subject==="English" || subject==="Chichewa"){

    level.innerHTML=`

    <option value="">Select Paper</option>

    <option>Paper I</option>

    <option>Paper II</option>

    <option>Paper III</option>

    `;

}else{

    level.innerHTML=`

    <option value="">Select Class</option>

    <option>Form 3</option>

    <option>Form 4</option>

    `;

}

/* ==========================
   TABS
========================== */

let currentCategory="Books";

document.querySelectorAll(".tab").forEach(tab=>{

    tab.onclick=()=>{

        document.querySelectorAll(".tab")
        .forEach(t=>t.classList.remove("active"));

        tab.classList.add("active");

        currentCategory=tab.dataset.category;

        document.getElementById("category").value=currentCategory;

        loadFiles();

    };

});

document.getElementById("category").onchange=function(){

    currentCategory=this.value;

    document.querySelectorAll(".tab")
    .forEach(tab=>{

        tab.classList.remove("active");

        if(tab.dataset.category===currentCategory){

            tab.classList.add("active");

        }

    });

    loadFiles();

};

/* ==========================
   SEARCH
========================== */

document.getElementById("search").onkeyup=function(){

    const value=this.value.toLowerCase();

    document.querySelectorAll(".file-card")
    .forEach(card=>{

        const text=card.textContent.toLowerCase();

        card.style.display=text.includes(value)
        ?"flex":"none";

    });

};

/* ==========================
   LEVEL
========================== */

level.onchange=loadFiles;

/* ==========================
   LOAD FILES
========================== */

async function loadFiles(){

    const files=document.getElementById("files");

    const empty=document.getElementById("empty");

    files.innerHTML="";

    empty.style.display="none";

    let selectedLevel=level.value;

    if(selectedLevel==="") return;

    const folder=`uploads/${subject}/${selectedLevel}/${currentCategory}`;

    try{

        const result=await listAll(ref(storage,folder));

        if(result.items.length===0){

            empty.style.display="block";

            return;

        }

        for(const item of result.items){

            const url=await getDownloadURL(item);

            const card=document.createElement("div");

            card.className="file-card";

            card.innerHTML=`

            <div class="file-info">

            <h3>${item.name}</h3>

            <small>${currentCategory}</small>

            </div>

            <button class="download">

            Download

            </button>

            `;

            card.querySelector("button").onclick=()=>{

                window.open(url,"_blank");

            };

            files.appendChild(card);

        }

    }catch(error){

        console.log(error);

        empty.style.display="block";

    }

}

/* ==========================
   AUTO LOAD
========================== */

loadFiles();