// Declare variables

const emailLog = document.getElementById("email-log");
const inputsLog = document.getElementById("inputs-log");
const txtEmail = document.getElementById("txt-email");
const txtPassword = document.getElementById("txt-password");
const btnLogin = document.getElementById("btn-login");
//const btnSignUp = document.getElementById("btn-signup");
const btnLogout = document.getElementById("btn-logout");

// Add login event

btnLogin.addEventListener("click", (e) => {
     const email = txtEmail.value;
     const password = txtPassword.value;
     auth.signInWithEmailAndPassword(email, password).catch((e) => console.log(e.message));
});

// Add signup event

// btnSignUp.addEventListener("click", (e) => {
//      const email = txtEmail.value;
//      const password = txtPassword.value;
//      auth.createUserWithEmailAndPassword(email, password).catch((e) => console.log(e.message));
// });

// Add logout event

btnLogout.addEventListener("click", (e) => {
     auth.signOut().catch((e) => console.log(e.message));
});

// Add a realtime listener

auth.onAuthStateChanged((firebaseUser) => {
     if (firebaseUser) {
          emailLog.classList.remove("hide");
          inputsLog.classList.add("hide");
          // btnSignUp.classList.add("hide");
          btnLogin.classList.add("hide");
          btnLogout.classList.remove("hide");
          const userEmail = firebase.auth().currentUser.email;
          emailLog.textContent = userEmail;
          empty.textContent = "Votre liste est vide !";
          loadListItems();
     } else {
          emailLog.classList.add("hide");
          inputsLog.classList.remove("hide");
          // btnSignUp.classList.remove("hide");
          btnLogin.classList.remove("hide");
          btnLogout.classList.add("hide");
          emailLog.textContent = "Déconnecté";
          empty.textContent = "Vous devez vous connecter !";
          listItems = [];
          generateList();
     }
});
