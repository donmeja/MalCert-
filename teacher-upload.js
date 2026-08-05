/* ==========================
   TEACHER UPLOAD
========================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getStorage,
    ref,
    uploadBytesResumable
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

const auth = getAuth(app);

const storage = getStorage(app);

const db = getFirestore(app);

/* ==========================
   CHECK LOGIN
========================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    const snap = await getDoc(doc(db,"users",user.uid));

    if(!snap.exists()){

        alert("User account not found.");

        location.href="login.html";

        return;

    }

    if(snap.data().role !== "teacher"){

        alert("Access denied. Teachers only.");

        location.href="index.html";

    }

});

/* ==========================
   SUBJECT CHANGE
========================== */

const subject=document.getElementById("subject");

const classGroup=document.getElementById("classGroup");

const paperGroup=document.getElementById("paperGroup");

subject.onchange=function(){

    if(

        subject.value==="English" ||

        subject.value==="Chichewa"

    ){

        classGroup.style.display="none";

        paperGroup.style.display="block";

    }

    else{

        classGroup.style.display="block";

        paperGroup.style.display="none";

    }

};

/* ==========================
   UPLOAD
========================== */

document.getElementById("uploadBtn").onclick=function(){

    const subjectValue=subject.value;

    const category=document.getElementById("category").value;

    const file=document.getElementById("file").files[0];

    let level;

    if(subjectValue==="English" ||

       subjectValue==="Chichewa"){

        level=document.getElementById("paper").value;

    }

    else{

        level=document.getElementById("level").value;

    }

    if(subjectValue===""){

        alert("Select a subject.");

        return;

    }

    if(!file){

        alert("Choose a file.");

        return;

    }

    const path=

    `uploads/${subjectValue}/${level}/${category}/${file.name}`;

    const storageRef=ref(storage,path);

    const uploadTask=

    uploadBytesResumable(storageRef,file);

    document.getElementById("progressBox").style.display="block";

    uploadTask.on(

        "state_changed",

        snapshot=>{

            const percent=

            (snapshot.bytesTransferred/

            snapshot.totalBytes)*100;

            document.getElementById("progress").value=percent;

            document.getElementById("status").textContent=

            Math.round(percent)+"% Uploaded";

        },

        error=>{

            alert(error.message);

        },

        ()=>{

            document.getElementById("status").textContent=

            "Upload completed successfully.";

            alert("File uploaded successfully!");

            document.getElementById("file").value="";

            document.getElementById("progress").value=0;

        }

    );

};