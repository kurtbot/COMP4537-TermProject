const addr = "https://kmilan.ca/"
const tAddr = "http://localhost:8888";
// const rootURL = "comp4537/termproject/api/v1"
const rootURL = ""

function hide() {
    document.getElementById("errorId").style.display = "none";
    document.getElementById("errorUser").style.display = "none";
    document.getElementById("errorPw").style.display = "none";
    document.getElementById("confirmPw").style.display = "none";
}

// [POST]
function addUser(){
    let noErr = true;

    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("chk_password").value;

    hide();

    // if username is blank
    if (!username){
        console.log("username missing");
        document.getElementById("errorUser").style.display = "block";
        document.getElementById("errorUser").innerHTML = "Please enter a username";
        noErr = false;
    }

    // if password is blank
    if (!password){
        console.log("password missing");
        document.getElementById("errorPw").style.display = "block";
        document.getElementById("errorPw").innerHTML = "Please enter a password";
        noErr = false;
    }

    // if confirm pasword blank
    if (!password){
        console.log("didn't confirm pw");
        document.getElementById("confirmPw").style.display = "block";
        document.getElementById("confirmPw").innerHTML = "Please confirm your password";
        noErr = false;
    }

    // passwords don't match
    if (password != confirmPassword) {
        console.log("password mismatch");
        document.getElementById("confirmPw").style.display = "block";
        document.getElementById("confirmPw").innerHTML = "Passwords do not match";
        noErr = false;
    }

    if (emailIsValid(email)){
        console.log("valid email");
        if (noErr){
            ( async() => {
                let result = await fetch(tAddr + rootURL + '/user', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: password,
                    })
                    }).then(res => {
                        if (res.ok) return res.json();
                    }).then(res => {
                        // localStorage.setItem('TTTuserId', res.insertId);
                        sessionStorage.setItem('TTTuserId', res.insertId);
                        window.location.href = 'index.html';
                    })
            })();
        }
    } else {    // invalid email format
        console.log("invalid email");
        emailError = document.getElementById("errorId").style.display = "block";
        document.getElementById("errorId").innerHTML = "Please enter a valid email address";
    }
    return false;
}