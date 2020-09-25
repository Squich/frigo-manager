const txtEmail = document.getElementById("txt-email");
const txtPassword = document.getElementById("txt-password");
const btnLogin = document.getElementById("btn-login");
const btnSignUp = document.getElementById("btn-signup");
const btnLogout = document.getElementById("btn-logout");

// Add login event

btnLogin.addEventListener("click", e => {
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  auth.signInWithEmailAndPassword(email, password).catch(e => console.log(e.message));
});

// Add signup event

btnSignUp.addEventListener("click", e => {
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  // Create user
  auth.createUserEmailAndPassword(email, password).catch(e => console.log(e.message));
});

btnLogout.addEventListener("click", e => {
  firebase.auth().signOut();
});

// Add a realtime listener

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    btnLogout.classList.remove("hide");
  } else {
    console.log("not logged in");
    btnLogout.classList.add("hide");
  }
});
